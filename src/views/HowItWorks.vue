# src/views/HowItWorks.vue
<template>
  <div class="prose prose-invert max-w-none">
    <h1 class="text-4xl font-bold mb-8">How BugScout.ai Works</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div v-for="(step, index) in steps" :key="index" 
           class="bg-gray-800 rounded-lg p-6 relative overflow-hidden">
        <div class="absolute top-0 right-0 px-4 py-2 bg-blue-600 rounded-bl-lg text-sm">
          Step {{ index + 1 }}
        </div>
        <h3 class="text-xl font-semibold mb-4">{{ step.title }}</h3>
        <p class="text-gray-300">{{ step.description }}</p>
      </div>
    </div>

    <!-- Features Section -->
    <div class="mb-12">
      <h2 class="text-3xl font-bold mb-6">Key Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="feature in features" :key="feature.title" 
             class="bg-gray-800/50 rounded-lg p-6">
          <div class="text-blue-400 mb-4">
            <component :is="feature.icon" class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-gray-400 text-sm">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Technology Stack -->
    <div class="mb-12">
      <h2 class="text-3xl font-bold mb-6">Our Technology Stack</h2>
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="tech in technologies" :key="tech.name" 
               class="flex flex-col items-center">
            <img :src="tech.logo" :alt="tech.name" class="h-12 mb-2">
            <span class="text-sm text-gray-300">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Ready to Get Started?</h2>
      <p class="text-gray-200 mb-6">Join our community of smart contract auditors and developers</p>
      <button 
        @click="$router.push('/')"
        class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Start Analyzing
      </button>
    </div>
  </div>
</template>

<script setup>
const steps = [
  {
    title: 'Connect Your Wallet',
    description: 'Start by connecting your MetaMask wallet to access the platform and interact with smart contracts.'
  },
  {
    title: 'Submit Smart Contract',
    description: 'Paste your smart contract code or provide the contract address you want to analyze.'
  },
  {
    title: 'AI Analysis',
    description: 'Our AI engine performs a comprehensive analysis to identify potential vulnerabilities and security risks.'
  },
  {
    title: 'Review Report',
    description: 'Get detailed insights about potential issues, risk scores, and recommendations for improvement.'
  }
]

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms to detect vulnerabilities and potential security risks.',
    icon: 'div' // Replace with actual icon component
  },
  {
    title: 'Decentralized Verification',
    description: 'Reports are stored on-chain for transparency and immutable record-keeping.',
    icon: 'div'
  },
  {
    title: 'Community Driven',
    description: 'Join a network of security experts and developers to improve smart contract security.',
    icon: 'div'
  }
]

const technologies = [
  {
    name: 'Ethereum',
    logo: '/api/placeholder/48/48'
  },
  {
    name: 'MutliChain',
    logo: '/api/placeholder/48/48'
  },
  {
    name: 'Vue.js',
    logo: '/api/placeholder/48/48'
  },
  {
    name: 'AI/ML',
    logo: '/api/placeholder/48/48'
  }
]
</script>