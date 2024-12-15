<template>
  <div class="transaction-handler">
    <!-- Loading State -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-10 w-10 text-blue-500 mb-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p class="text-white text-center">{{ message }}</p>
          <p class="text-gray-400 text-sm text-center mt-2">Please confirm the transaction in your wallet</p>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccess" 
         class="fixed top-4 right-4 bg-green-900 text-green-100 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
      </svg>
      {{ successMessage }}
      <button @click="showSuccess = false" class="ml-4 text-green-300 hover:text-green-100">
        ✕
      </button>
    </div>

    <!-- Error Toast -->
    <div v-if="error" 
         class="fixed top-4 right-4 bg-red-900 text-red-100 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      {{ error }}
      <button @click="$emit('update:error', '')" class="ml-4 text-red-300 hover:text-red-100">
        ✕
      </button>
    </div>

    <!-- Transaction Details -->
    <div v-if="txHash" class="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl z-50">
      <div class="flex items-center">
        <span class="text-sm text-gray-400 mr-2">Transaction:</span>
        <a 
          :href="`https://sepolia.mantlescan.xyz/address/${txHash}`"
          target="_blank"
          class="text-blue-400 hover:text-blue-300 font-mono"
        >
          {{ shortenHash(txHash) }}
        </a>
        <span 
          class="ml-4 px-2 py-1 rounded-full text-xs"
          :class="txPending ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'"
        >
          {{ txPending ? 'Pending' : 'Confirmed' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  isLoading: Boolean,
  error: String,
  txHash: String,
  txPending: Boolean,
  message: {
    type: String,
    default: 'Processing transaction...'
  }
})

const emit = defineEmits(['update:error'])

// Local state
const showSuccess = ref(false)
const successMessage = ref('Transaction successful!')

// Watch for transaction confirmation
watch(() => props.txPending, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  }
})

function shortenHash(hash) {
  if (!hash) return ''
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}
</script>