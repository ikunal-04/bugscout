<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
    
    <div class="space-y-6">
      <div v-for="(category, index) in faqCategories" :key="index" class="mb-12">
        <h2 class="text-2xl font-semibold mb-6 text-blue-400">{{ category.title }}</h2>
        
        <div class="space-y-4">
          <div v-for="(faq, faqIndex) in category.items" 
               :key="faqIndex"
               class="bg-gray-800 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(category.id, faqIndex)"
              class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700"
            >
              <span class="font-medium">{{ faq.question }}</span>
              <svg
                class="w-5 h-5 transform transition-transform"
                :class="{ 'rotate-180': faq.isOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              v-show="faq.isOpen"
              class="px-6 py-4 text-gray-300 border-t border-gray-700"
            >
              <p v-html="faq.answer"></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Support Section -->
    <div class="mt-12 bg-gray-800 rounded-lg p-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Still Have Questions?</h2>
      <p class="text-gray-300 mb-6">
        Can't find the answer you're looking for? Feel free to reach out through Github issues.
      </p>
      <!-- <div class="flex justify-center space-x-4">
        <a 
          href="https://discord.gg/your-server" 
          target="_blank"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <span class="mr-2">Join Discord</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </a>
        <a 
          href="mailto:support@BugScout.ai"
          class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <span class="mr-2">Email Support</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const faqCategories = reactive([
  {
    id: 'general',
    title: 'General Questions',
    items: [
      {
        question: 'What is BugScout.ai?',
        answer: 'BugScout.ai is an AI-powered smart contract analysis platform that helps developers and auditors identify potential vulnerabilities and security risks in their smart contracts.',
        isOpen: false
      },
      {
        question: 'How does the analysis work?',
        answer: 'Our platform uses advanced AI algorithms to analyze smart contract code, identifying common vulnerabilities, security risks, and potential optimizations. The analysis is based on a comprehensive database of known vulnerabilities and best practices.',
        isOpen: false
      },
      {
        question: 'Is BugScout.ai free to use?',
        answer: 'Basic analysis features are free to use. Premium features and detailed reports may require payment in Mutlitokens.',
        isOpen: false
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Questions',
    items: [
      {
        question: 'Which smart contract languages are supported?',
        answer: 'Currently, we support Solidity smart contracts. Support for additional languages is coming soon.',
        isOpen: false
      },
      {
        question: 'How accurate is the AI analysis?',
        answer: 'Our AI model has been trained on thousands of audited smart contracts and continuously improves. However, we recommend using it as a complementary tool alongside manual auditing.',
        isOpen: false
      },
      {
        question: 'Can I analyze private contracts?',
        answer: 'Yes, all analysis is performed locally in your browser. Your contract code is never stored on our servers.',
        isOpen: false
      }
    ]
  },
  {
    id: 'network',
    title: 'Network & Wallet',
    items: [
      {
        question: 'Which networks are supported?',
        answer: 'BugScout.ai currently operates on the MutliChain Testnet. Support for additional networks is planned for future releases.',
        isOpen: false
      },
      {
        question: 'Why do I need to connect a wallet?',
        answer: 'A wallet connection is required to submit analysis reports to the blockchain and participate in the verification process.',
        isOpen: false
      }
    ]
  }
])

function toggleFaq(categoryId, faqIndex) {
  const category = faqCategories.find(c => c.id === categoryId)
  if (category) {
    category.items[faqIndex].isOpen = !category.items[faqIndex].isOpen
  }
}
</script>