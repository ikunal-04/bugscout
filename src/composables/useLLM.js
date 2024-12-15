import { ref } from 'vue'
import axios from 'axios'

export function useLLM() {
  const isLoading = ref(false)
  const error = ref(null)

  const API_URL = 'https://metamask.gaia.domains/v1/chat/completions'

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    withCredentials: false  // Important for CORS
  })

  // Helper to extract key points from analysis
  function extractKeyPoints(text) {
    console.log('Raw LLM Response:', text)
    
    const lines = text.split(/[\n•-]/).filter(line => line.trim())
    const issues = []
    const suggestions = []
    let maxSeverityScore = 0
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
  
      // Check for explicit severity levels
      if (trimmed.toLowerCase().includes('severity level')) {
        const severity = trimmed.toLowerCase()
        if (severity.includes('critical')) maxSeverityScore = Math.max(maxSeverityScore, 100)
        else if (severity.includes('high')) maxSeverityScore = Math.max(maxSeverityScore, 90)
        else if (severity.includes('medium')) maxSeverityScore = Math.max(maxSeverityScore, 50)
        else if (severity.includes('low')) maxSeverityScore = Math.max(maxSeverityScore, 30)
      }
  
      // Check for severity scores
      const scoreMatch = trimmed.match(/severity score:?\s*(\d+)/i)
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1])
        if (!isNaN(score)) {
          maxSeverityScore = Math.max(maxSeverityScore, score)
        }
      }
  
      // Determine issue severity
      let severity = 'medium'
      if (trimmed.toLowerCase().includes('critical')) severity = 'critical'
      else if (trimmed.toLowerCase().includes('high')) severity = 'high'
      else if (trimmed.toLowerCase().includes('low')) severity = 'low'
  
      // Parse issues
      if (trimmed.toLowerCase().includes('issue summary')) {
        const description = trimmed.split('**Issue Summary:**').pop().trim()
        issues.push({
          severity,
          title: description.split('.')[0],
          description: description
        })
      }
    }
  
    // If no explicit severity score was found, calculate based on highest severity issue
    if (maxSeverityScore === 0 && issues.length > 0) {
      if (issues.some(i => i.severity === 'critical')) maxSeverityScore = 100
      else if (issues.some(i => i.severity === 'high')) maxSeverityScore = 90
      else if (issues.some(i => i.severity === 'medium')) maxSeverityScore = 50
      else maxSeverityScore = 30
    }
  
    return {
      issues,
      suggestions: suggestions.length ? suggestions : [{
        title: 'Security Review',
        description: issues.length ? 
          'Consider addressing the identified vulnerabilities before deployment.' :
          'While no issues were found, consider regular security reviews and testing.'
      }],
      riskScore: maxSeverityScore || (issues.length === 0 ? 10 : 50) // Default to 50 if issues found but no severity score
    }
  }

  async function analyzeContract(code) {
    if (!code?.trim()) {
      throw new Error('No code provided')
    }
  
    isLoading.value = true
    error.value = null
  
    try {
      const response = await axiosInstance.post('', {
        model: 'llama',
        messages: [
          {
            role: "system",
            content: `You are a highly specialized smart contract security auditor. Your task is to perform an in-depth security analysis of the submitted smart contract code. Do not describe the code’s functionality or suggest general improvements—focus solely on identifying and explaining security vulnerabilities. For each security issue found, follow this precise format:

Severity Level: Label the severity as either Critical, High, Medium, or Low.
Severity Score (0-100): Assign a score that reflects the risk level of the issue.
Issue Summary: Provide a one-sentence description of the issue, clearly stating the security risk or vulnerability.
Recommended Fix: Offer a direct, actionable fix for the issue in one concise sentence.

If the analysis reveals no security vulnerabilities, respond only with 'No issues found.' Avoid all other commentary, explanations, or interpretations. Your response should focus exclusively on any security issues found and their recommended fixes.`
          },
          {
            role: "user",
            content: code
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
  
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid API response')
      }
  
      const analysisText = response.data.choices[0].message.content
      console.log('Raw LLM Response:', analysisText)
  
      // Check if response indicates inability to analyze
      if (analysisText.toLowerCase().includes('unable to analyze') ||
          analysisText.toLowerCase().includes("can't analyze") ||
          analysisText.toLowerCase().includes('cannot analyze') ||
          analysisText.toLowerCase().includes('please provide')) {
        return {
          rawResponse: analysisText.trim(),
          isError: true
        }
      }
  
      // Normal analysis processing
      const { issues, suggestions, riskScore } = extractKeyPoints(analysisText)
      return {
        issues,
        suggestions,
        riskScore,
        rawResponse: analysisText
      }
  
    } catch (err) {
      console.error('Full API Error:', err)
      error.value = err.message
      throw new Error('Analysis failed: ' + (err.response?.data?.error || err.message))
    } finally {
      isLoading.value = false
    }
  }

  return {
    analyzeContract,
    isLoading,
    error
  }
}