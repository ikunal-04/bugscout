# SubmitReportSection.vue

<template>
  <div class="bg-gradient-to-r from-blue-900/50 to-blue-800/30 rounded-xl p-8 border border-blue-700/50 shadow-lg">
    <div class="space-y-6">
      <div class="flex items-start justify-between">
        <div class="space-y-2">
          <h3 class="text-2xl font-bold text-blue-300">Submit Report On-Chain</h3>
          <p class="text-gray-300 text-lg">
            Permanently record this security analysis on MultiChain
          </p>
        </div>
        <button
          @click="$emit('submit')"
          :disabled="isSubmitting"
          class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 
                 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold text-lg shadow-xl 
                 transition-all duration-200 transform hover:scale-105"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
        </button>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mt-6">
        <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
          <h4 class="font-semibold text-blue-300 mb-2">Immutable Record</h4>
          <p class="text-gray-400">Once submitted, your analysis becomes a permanent, tamper-proof record on the blockchain.</p>
        </div>
        
        <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
          <h4 class="font-semibold text-blue-300 mb-2">Build Trust</h4>
          <p class="text-gray-400">Demonstrate transparency and commitment to security by making your audit results publicly verifiable.</p>
        </div>
        
        <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
          <h4 class="font-semibold text-blue-300 mb-2">Community Insight</h4>
          <p class="text-gray-400">Contribute to a growing database of security audits that helps improve overall ecosystem security.</p>
        </div>
      </div>

      <div v-if="txHash" class="mt-4 bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-gray-400">Transaction Status on Walrus (Blob-Id):</span>
            <span :class="[
              'px-2 py-1 rounded-full text-sm',
              txPending ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'
            ]">
              {{ txPending ? 'Pending' : 'Confirmed' }}
            </span>
          </div>
          <!-- <a
            :href="`https://walruscan.com/testnet/blob/${blobId}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400 hover:text-blue-300 underline text-sm"
          >
            View on Explorer
          </a> -->
          <p>{{blobId}}</p>
        </div>
      </div>
      
      <div class="text-sm text-gray-400 mt-4">
        <p>✨ Your submitted report will be Permanently stored on Walrus and becomes part of the platform's security knowledge base.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isSubmitting: {
    type: Boolean,
    default: false
  },
  txHash: {
    type: String,
    default: ''
  },
  blobId: {
    type: String,
    default: ''
  },
  txPending: {
    type: Boolean,
    default: false
  }
})

defineEmits(['submit'])
</script>