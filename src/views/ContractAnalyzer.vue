<template>
  <!-- Landing page for users without wallet connection -->
  <div v-if="!isConnected" class="space-y-20">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center"
      >
        <h1
          class="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
        >
          Secure Your Smart Contracts with AI
        </h1>
        <p class="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          BugScout.ai uses advanced AI to analyze your smart contracts, identify
          vulnerabilities, and ensure your code is production-ready.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <!-- <button 
            @click="connect"
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg flex items-center justify-center"
          >
            <span v-if="isLoading" class="mr-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </span>
            {{ isLoading ? 'Connecting...' : 'Connect Wallet to Start' }}
          </button> -->
          <a
            href="#how-it-works"
            class="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-lg"
          >
            Learn More
          </a>
        </div>
      </div>

      <!-- Animated Background -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div
          class="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"
        ></div>
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-3xl"
        ></div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12">
        Why Choose BugScout.ai?
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700"
        >
          <div
            class="text-blue-400 mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-400/10"
          >
            <component :is="feature.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-semibold mb-3">{{ feature.title }}</h3>
          <p class="text-gray-400">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div class="grid md:grid-cols-4 gap-8">
        <div v-for="(step, index) in steps" :key="step.title" class="relative">
          <div class="flex flex-col items-center text-center">
            <div
              class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold mb-4"
            >
              {{ index + 1 }}
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
            <p class="text-gray-400">{{ step.description }}</p>
          </div>
          <!-- Connector Line -->
          <div
            v-if="index < steps.length - 1"
            class="hidden md:block absolute top-1/4 left-full w-full h-0.5 bg-gray-700"
          ></div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-8 text-center">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-gray-800/50 rounded-xl p-8"
        >
          <div class="text-3xl font-bold text-blue-400 mb-2">
            {{ stat.value }}
          </div>
          <div class="text-gray-300">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center"
      >
        <h2 class="text-3xl font-bold mb-6">
          Ready to Secure Your Smart Contracts?
        </h2>
        <p class="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who trust BugScout.ai for their smart
          contract security needs.
        </p>
        <button
          @click="connect"
          class="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold text-lg"
        >
          Get Started Now
        </button>
      </div>
    </section>
  </div>

  <!-- Contract Analysis UI for connected users -->
  <div v-else>
    <div class="w-full max-w-7xl mx-auto space-y-8 p-4">
      <!-- Instructions -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">
          Smart Contract Security Analyzer
        </h2>
        <div class="prose prose-invert max-w-none">
          <p class="text-gray-300">
            This tool helps you analyze smart contracts for potential security
            vulnerabilities and optimization opportunities. Follow these steps:
          </p>
          <ol class="text-gray-300 list-decimal list-inside space-y-2 mt-4">
            <li>
              Paste your smart contract's Solidity code in the input box below
            </li>
            <li>Click "Analyze Contract" to start the security scan</li>
            <li>Review the findings in the analysis report</li>
            <li>Optionally submit the report on-chain for permanent record</li>
          </ol>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0 mt-1">
            <svg
              class="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2">Analyzing Options</h3>
            <div class="space-y-4 text-gray-300">
              <div>
                <h4 class="font-medium text-blue-400">
                  Option 1: Import Verified Contract
                </h4>
                <p class="mt-1 text-sm">
                  Use the contract import feature below to analyze verified
                  contracts on MutliChain. Simply enter the contract address and
                  the tool will fetch the verified source code automatically.
                </p>
              </div>

              <div>
                <h4 class="font-medium text-blue-400">
                  Option 2: Direct Code Analysis
                </h4>
                <p class="mt-1 text-sm">
                  For contracts not verified on MutliChain or contracts under
                  development, you can paste your smart contract code directly
                  into the text area below for analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Import Contract Section with modified title -->
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Import Verified Contracts</h2>
          <span class="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded"
            >Supports MutliChain Only</span
          >
        </div>

        <div class="flex gap-4 mb-6">
          <input
            type="text"
            v-model="contractAddress"
            placeholder="Enter verified contract address (0x...)"
            class="flex-1 p-2 bg-gray-900 rounded-lg border border-gray-700 text-white font-mono"
          />
          <button
            @click="handleImportContract"
            :disabled="isImporting || !isValidAddress"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg flex items-center"
          >
            <span v-if="isImporting" class="mr-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            {{ isImporting ? "Importing..." : "Import Contract" }}
          </button>
        </div>

        <!-- Import Error Alert -->
        <div
          v-if="importError"
          class="mt-4 p-4 bg-red-900/30 rounded-lg text-red-300"
        >
          {{ importError }}
        </div>
      </div>

      <!-- Analysis Input Section -->
      <div class="grid grid-cols-1 gap-8">
        <!-- Code Input -->
        <div class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Contract Code</h2>
          <div class="mb-4">
            <textarea
              v-model="contractCode"
              placeholder="// Paste your Solidity smart contract code here...
            
contract Example {
    // Your contract code
}"
              class="w-full h-64 p-4 bg-gray-900 rounded-lg border border-gray-700 text-white font-mono"
            ></textarea>
          </div>
          <div class="space-y-4 mb-3 text-gray-300">
            <div class="mt-4 bg-gray-900/50 rounded-lg p-4">
              <div class="flex items-start space-x-2">
                <div class="flex-shrink-0">
                  <svg
                    class="w-5 h-5 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div class="text-sm text-gray-400">
                  <p>
                    Currently using
                    <span class="text-yellow-500 font-mono"
                      >Codestral by Mistral.ai</span
                    >
                    model for analysis. More powerful models will be integrated
                    in future updates to enhance analysis capabilities.<br />
                    <br />
                    <strong>Note:</strong> Analysis results are for reference
                    only and should not be considered as a complete security
                    audit. Always perform thorough testing and professional
                    audits before deploying contracts to production.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex space-x-4">
            <button
              @click="handleAnalyzeContract"
              :disabled="isAnalyzing || !contractCode"
              class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
            >
              <span v-if="isAnalyzing" class="mr-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
              {{ isAnalyzing ? "Analyzing..." : "Analyze Contract" }}
            </button>
            <button
              @click="handleClearAnalysis"
              :disabled="!analysisResult"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>
        <div v-if="isAnalyzing" class="bg-gray-800 rounded-lg p-6">
          <div class="flex items-center justify-center space-x-3">
            <svg
              class="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-gray-300">Analyzing contract security...</span>
          </div>
        </div>

        <!-- Streaming Response (Debug) -->
        <div
          v-if="streamingResult && isAnalyzing"
          class="bg-gray-800 rounded-lg p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Analysis in Progress</h3>
            <span class="text-sm text-gray-400"
              >AI is analyzing your contract...</span
            >
          </div>
          <pre
            class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap text-gray-300"
            >{{ streamingResult }}</pre
          >
        </div>

        <!-- Quick Stats -->
        <div v-if="analysisResult" class="bg-gray-800 rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-6">Analysis Summary</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-700 rounded-lg p-4">
              <h3 class="text-sm text-gray-400 mb-1">Risk Score</h3>
              <div :class="[riskScoreTextColor]">
                {{ analysisResult.riskScore }}%
              </div>
            </div>
            <div class="bg-gray-700 rounded-lg p-4">
              <h3 class="text-sm text-gray-400 mb-1">Issues Found</h3>
              <div class="text-3xl font-bold">
                {{ analysisResult.issues.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Analysis Results -->
      <div v-if="analysisResult || analysisError" class="space-y-6">
        <!-- Analysis Error/Note -->
        <div v-if="analysisError" class="bg-gray-800 rounded-lg p-6">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <svg
                class="w-5 h-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-yellow-400">Analysis Note</h3>
              <div class="mt-2 text-gray-300 text-sm whitespace-pre-wrap">
                {{ analysisError }}
              </div>
            </div>
          </div>
        </div>

        <!-- Regular Analysis Results (only show if valid analysis) -->
        <template
          v-if="analysisResult && !analysisError && !analysisResult.isError"
        >
          <!-- Risk Score Progress -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Risk Assessment</h3>
            <div class="flex items-center mb-4">
              <div class="w-full bg-gray-700 rounded-full h-4">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="riskScoreColor"
                  :style="{ width: `${analysisResult.riskScore}%` }"
                ></div>
              </div>
              <span class="ml-4 font-mono"
                >{{ analysisResult.riskScore }}%</span
              >
            </div>
          </div>

          <!-- Issues Found -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Detected Issues</h3>
            <div v-if="analysisResult.issues.length" class="space-y-4">
              <div
                v-for="(issue, index) in analysisResult.issues"
                :key="index"
                class="p-4 rounded-lg"
                :class="getIssueBgColor(issue.severity)"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <span
                      class="text-2xl"
                      :class="getIssueSeverityColor(issue.severity)"
                      >●</span
                    >
                  </div>
                  <div class="ml-3">
                    <div class="flex items-center space-x-2">
                      <h4 class="font-medium">{{ issue.title }}</h4>
                      <span
                        class="px-2 py-0.5 text-xs rounded-full capitalize"
                        :class="getIssueSeverityBadgeColor(issue.severity)"
                      >
                        {{ issue.severity }}
                      </span>
                    </div>
                    <p class="text-gray-400 mt-1">{{ issue.description }}</p>
                    <div v-if="issue.codeSnippet" class="mt-2">
                      <pre
                        class="bg-gray-900 p-3 rounded-lg overflow-x-auto text-sm"
                        >{{ issue.codeSnippet }}</pre
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-400 text-center py-4">
              No issues detected
            </div>
          </div>

          <!-- Submit Report Section -->
          <SubmitReportSection
            v-if="analysisResult"
            :is-submitting="isSubmitting"
            :tx-hash="txHash"
            :tx-pending="txPending"
            :blob-id="blobId1"
            @submit="handleSubmitReport"
          />
        </template>

        <!-- Raw LLM Response (show when isError is true) -->
        <div
          v-else-if="analysisResult?.isError"
          class="bg-gray-800 rounded-lg p-6"
        >
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <svg
                class="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-blue-400">
                Analysis Response
              </h3>
              <div class="mt-2 text-gray-300 text-sm whitespace-pre-wrap">
                {{ analysisResult.rawResponse }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useContract } from "../composables/useContract";
import { useWallet } from "../composables/useWallet";
import { useLLM } from "../composables/useLLM";
import axios from "axios";
import { ethers } from "ethers";
import { Shield, Zap, Users } from "lucide-vue-next";
import SubmitReportSection from "../components/SubmitReportSection.vue";

// Component state
const contractCode = ref("");
const contractAddress = ref("");
const isAnalyzing = ref(false);
const isSubmitting = ref(false);
const isImporting = ref(false);
const importError = ref("");
const analysisError = ref("");
const analysisResult = ref(null);
const txHash = ref("");
const blobId1 = ref("");
const txPending = ref(false);
const streamingResult = ref("");

// Get composables
const { isConnected, isCorrectChain, isLoading } = useWallet();
const { submitReport: submitContractReport } = useContract();
const {
  analyzeContract: llmAnalyze,
  error: llmError,
  analysisStream,
} = useLLM();

const features = [
  {
    icon: Shield,
    title: "Advanced AI Analysis",
    description:
      "Our AI engine uses state-of-the-art algorithms to detect vulnerabilities and security risks in your smart contracts.",
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description:
      "Get instant feedback on your code with detailed reports and actionable recommendations.",
  },
  {
    icon: Users,
    title: "Community Verified",
    description:
      "All analysis reports are verified by our community of security experts and stored on-chain.",
  },
];

const steps = [
  {
    title: "Connect Wallet",
    description: "Connect your MetaMask wallet to access the platform.",
  },
  {
    title: "Submit Contract",
    description: "Paste your contract code or import from verified sources.",
  },
  {
    title: "AI Analysis",
    description: "Our AI engine analyzes your code for vulnerabilities.",
  },
  {
    title: "Get Report",
    description: "Review detailed findings and recommendations.",
  },
];

// const stats = [
//   {
//     value: '500K+',
//     label: 'Contracts Analyzed'
//   },
//   {
//     value: '10K+',
//     label: 'Vulnerabilities Found'
//   },
//   {
//     value: '5,000+',
//     label: 'Active Users'
//   }
// ]

// Computed properties
const isValidAddress = computed(() => {
  try {
    return ethers.isAddress(contractAddress.value);
  } catch {
    return false;
  }
});

const riskScoreColor = computed(() => {
  const score = analysisResult.value?.riskScore || 0;
  // For critical/high severity issues (70-100)
  if (score >= 70) return "bg-red-500";
  // For medium severity issues (30-69)
  if (score >= 30) return "bg-yellow-500";
  // For low severity/no issues (0-29)
  return "bg-green-500";
});

const riskScoreTextColor = computed(() => {
  const score = analysisResult.value?.riskScore || 0;
  if (score >= 70) return "text-red-400";
  if (score >= 30) return "text-yellow-400";
  return "text-green-400";
});

const getSubmitButtonText = computed(() => {
  if (!isConnected.value) return "Connect Wallet to Submit";
  if (!isCorrectChain.value) return "Switch to MutliTestnet";
  if (isSubmitting.value) return "Submitting...";
  return "Submit Report";
});

// Watch for LLM errors
watch(llmError, (newError) => {
  if (newError) {
    analysisError.value = newError;
    isAnalyzing.value = false;
  }
});

function isValidSmartContract(code) {
  const codeStr = code.toLowerCase().trim();

  // Basic checks for common contract indicators
  const hasContractKeyword =
    codeStr.includes("contract ") || codeStr.includes("abstract contract ");
  const hasPragma = codeStr.includes("pragma solidity");
  const hasFunction = codeStr.includes("function ");

  // Check for common contract elements
  const hasCommonElements = [
    "public",
    "private",
    "internal",
    "external",
    "view",
    "pure",
    "payable",
    "returns",
    "address",
    "uint",
    "bool",
    "struct",
    "mapping",
  ].some((keyword) => codeStr.includes(keyword));

  // More specific checks for contract structure
  const hasContractStructure = /contract\s+\w+\s*{[\s\S]*}/.test(code);
  const hasImports = code.includes("import ") || code.includes("IERC");

  // Count significant lines (non-empty, non-comment)
  const significantLines = code.split("\n").filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed &&
      !trimmed.startsWith("//") &&
      !trimmed.startsWith("/*") &&
      !trimmed.startsWith("*")
    );
  }).length;

  // Scoring system for validation
  let validityScore = 0;
  if (hasContractKeyword) validityScore += 2;
  if (hasPragma) validityScore += 2;
  if (hasFunction) validityScore += 2;
  if (hasCommonElements) validityScore += 2;
  if (hasContractStructure) validityScore += 3;
  if (hasImports) validityScore += 1;
  if (significantLines > 10) validityScore += 2;

  return validityScore >= 6; // Require a minimum score to be considered valid
}

// Helper to check if LLM response indicates inability to analyze
function isAnalysisErrorResponse(text) {
  const errorIndicators = [
    "unable to analyze",
    "can't analyze",
    "cannot analyze",
    "error analyzing",
    "please provide",
    "need the contract",
    "share the contract",
    "require the source code",
  ];

  return errorIndicators.some((indicator) =>
    text.toLowerCase().includes(indicator.toLowerCase())
  );
}

function getIssueSeverityBadgeColor(severity) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-900 text-red-200";
    case "high":
      return "bg-orange-900 text-orange-200";
    case "medium":
      return "bg-yellow-900 text-yellow-200";
    default:
      return "bg-green-900 text-green-200";
  }
}

// Methods
async function handleImportContract() {
  // Assuming you're using ethers.js or web3.js to get the connected wallet's chain
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (!isValidAddress.value) return;
  isImporting.value = true;
  importError.value = "";

  const chainId = Number(network.chainId);

  try {
    let response;
    console.log("Current Chain ID:", chainId);

    switch (chainId) {
      case 84532: // Base Sepolia
        response = await axios.get(
          `https://base-sepolia.blockscout.com/api/v2/smart-contracts/${contractAddress.value}`,
          {
            headers: { accept: "application/json" },
          }
        );
        processEVMContract(response.data);
        break;

      case 5003: 
        response = await axios.get(
          `https://explorer.sepolia.mantle.xyz/api/v2/smart-contracts/${contractAddress.value}`,
          {
            headers: { accept: "application/json" },
          }
        );
        processEVMContract(response.data);
        break;
      case 97: // BNB Testnet
        response = await axios.get(
          `https://api-testnet.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress.value}&apikey=8TMEYFU6KN1WWKV3DJNP5QYI2BD5127YZE`
        );

        if (response.data.status === "1" && response.data.result.length > 0) {
          processEVMContract(response.data.result[0]);
        } else {
          throw new Error("Contract not found or not verified");
        }
        break;

      case 1287: // Moonbase Alpha (Polkadot/Substrate)
        response = await axios.get("https://api-moonbase.moonscan.io/api", {
          params: {
            module: "contract",
            action: "getsourcecode",
            address: contractAddress.value,
            apikey: "Z7NAZ6VZDQRDN9PG9ZFT9SWRE2U65NFV11", // You'll need to add your Moonscan API key
          },
        });

        if (response.data.status === "1" && response.data.result.length > 0) {
          processPolkadotContract(response.data.result[0]);
        } else {
          throw new Error("Contract not found or not verified");
        }
        break;
      case 5115:
        response = await axios.get(
          `https://explorer.testnet.citrea.xyz/api/v2/smart-contracts/${contractAddress.value}`,
          {
            headers: { accept: "application/json" },
          }
        );

        processEVMContract(response.data);
        break;

      default:
        throw new Error(`Unsupported network with chainId: ${chainId}`);
    }
  } catch (error) {
    console.error(`Error importing contract:`, error);
    importError.value =
      error.response?.data?.message ||
      error.message ||
      "Failed to import contract";
  } finally {
    isImporting.value = false;
  }
}

function processEVMContract(contractData) {
  // Extract the source code field
  const sourceCode = contractData.SourceCode || contractData.source_code;

  if (!sourceCode) {
    throw new Error(
      "Contract source code not available. The contract may not be verified."
    );
  }

  let fullCode = sourceCode;

  try {
    // Check if the source code is a JSON string
    if (sourceCode.trim().startsWith("{{")) {
      // Normalize braces and parse the JSON structure
      const parsedSource = JSON.parse(
        sourceCode.replace(/{{/g, "{").replace(/}}/g, "}")
      );

      // Iterate through the sources to find the first Solidity file content
      const sources = parsedSource?.sources;
      if (!sources || typeof sources !== "object") {
        throw new Error(
          "Invalid source structure in the provided source code."
        );
      }

      const fileNames = Object.keys(sources);
      if (fileNames.length === 0) {
        throw new Error("No source files found in the provided source code.");
      }

      // Extract the first file's content
      const firstFileName = fileNames[0];
      const content = sources[firstFileName]?.content;

      if (!content) {
        throw new Error(
          `Solidity code content not found in the file: ${firstFileName}`
        );
      }

      fullCode = content;
    }
  } catch (error) {
    throw new Error(`Failed to parse contract source code: ${error.message}`);
  }

  // Add compiler version if available
  if (contractData.CompilerVersion || contractData.compiler_version) {
    fullCode = `// Compiler: ${
      contractData.CompilerVersion || contractData.compiler_version
    }\n${fullCode}`;
  }

  // Assign processed code to the reactive state
  contractCode.value = fullCode;
  analysisResult.value = null;
  analysisError.value = "";

  // Return the processed code for further use
  return fullCode;
}

function processPolkadotContract(contractData) {
  const sourceCode = contractData.SourceCode || contractData.source_code;

  if (!sourceCode) {
    throw new Error(
      "Contract source code not available. The contract may not be verified."
    );
  }

  let fullCode = sourceCode;

  try {
    // Check if the source code is a JSON string
    if (sourceCode.trim().startsWith("{{")) {
      // Normalize braces and parse the JSON structure
      const parsedSource = JSON.parse(
        sourceCode.replace(/{{/g, "{").replace(/}}/g, "}")
      );

      // Iterate through the sources to find the first Solidity file content
      const sources = parsedSource?.sources;
      if (!sources || typeof sources !== "object") {
        throw new Error(
          "Invalid source structure in the provided source code."
        );
      }

      const fileNames = Object.keys(sources);
      if (fileNames.length === 0) {
        throw new Error("No source files found in the provided source code.");
      }

      // Extract the first file's content
      const firstFileName = fileNames[0];
      const content = sources[firstFileName]?.content;

      if (!content) {
        throw new Error(
          `Solidity code content not found in the file: ${firstFileName}`
        );
      }

      fullCode = content;
    }
  } catch (error) {
    throw new Error(`Failed to parse contract source code: ${error.message}`);
  }

  // Add compiler version if available
  if (contractData.CompilerVersion || contractData.compiler_version) {
    fullCode = `// Compiler: ${
      contractData.CompilerVersion || contractData.compiler_version
    }\n${fullCode}`;
  }

  // Assign processed code to the reactive state
  contractCode.value = fullCode;
  analysisResult.value = null;
  analysisError.value = "";

  // Return the processed code for further use
  return fullCode;
}

async function handleAnalyzeContract() {
  if (!contractCode.value.trim()) {
    analysisError.value = "Please provide contract code to analyze";
    return;
  }

  // Validate contract code
  if (!isValidSmartContract(contractCode.value)) {
    analysisError.value =
      "Please provide valid Solidity smart contract code. Make sure your code includes contract definition and basic Solidity elements.";
    return;
  }

  isAnalyzing.value = true;
  analysisError.value = "";
  analysisResult.value = null;

  try {
    const result = await llmAnalyze(contractCode.value);

    // Check if LLM response indicates it cannot analyze
    if (isAnalysisErrorResponse(result.rawResponse)) {
      analysisError.value = result.rawResponse;
      analysisResult.value = null;
      return;
    }

    // Force risk score to 10 if no actual issues found
    if (
      result.issues.length === 0 ||
      (result.issues.length === 1 &&
        result.issues[0].title.toLowerCase().includes("no security issues"))
    ) {
      result.riskScore = 10;
      result.issues = [
        {
          severity: "low",
          title: "No Security Issues Found",
          description:
            "Code analysis found no significant security vulnerabilities.",
        },
      ];
    }

    // Only set analysis result if it's a valid analysis
    analysisResult.value = result;
  } catch (error) {
    console.error("Error analyzing contract:", error);
    analysisError.value = error.message;
  } finally {
    isAnalyzing.value = false;
  }
}

async function handleSubmitReport() {
  if (!analysisResult.value || !isConnected.value || !isCorrectChain.value)
    return;

  isSubmitting.value = true;
  txPending.value = true;

  try {
    const { receipt, success, blobId } = await submitContractReport({
      contractAddress: contractAddress.value || ethers.ZeroAddress,
      riskScore: Math.floor(analysisResult.value.riskScore),
      issues: analysisResult.value.issues,
      suggestions: analysisResult.value.suggestions,
    });

    if (success && receipt?.hash) {
      txHash.value = receipt.hash;
      txPending.value = false;
      blobId1.value = blobId;
    }
  } catch (error) {
    console.error("Error submitting report:", error);
    alert(`Failed to submit report: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
}

function handleClearAnalysis() {
  contractCode.value = "";
  contractAddress.value = "";
  analysisResult.value = null;
  analysisError.value = "";
  txHash.value = "";
  txPending.value = false;
  streamingResult.value = "";
  importError.value = "";
}

function getIssueSeverityColor(severity) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "text-red-500";
    case "high":
      return "text-orange-500";
    case "medium":
      return "text-yellow-500";
    default:
      return "text-green-500";
  }
}

function getIssueBgColor(severity) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-900/30";
    case "high":
      return "bg-orange-900/30";
    case "medium":
      return "bg-yellow-900/30";
    default:
      return "bg-green-900/30";
  }
}

function shortenHash(hash) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}
</script>
