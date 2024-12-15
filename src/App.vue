# src/App.vue
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <nav class="border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <!-- Logo and Navigation -->
            <div class="flex items-center space-x-8">
              <router-link to="/" class="text-2xl font-bold flex items-center">
                🔍 BugScout.ai
              </router-link>
              
              <div class="hidden md:flex space-x-6">
                <router-link 
                  v-for="item in navigation" 
                  :key="item.name"
                  :to="item.href"
                  class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  :class="{ 'bg-gray-800': isCurrentRoute(item.href) }"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </div>

            <!-- Wallet Connection -->
            <div class="flex items-center space-x-4">
              <!-- Network Status -->
              <div v-if="isConnected && !isCorrectChain" 
                   class="hidden md:flex items-center text-yellow-500 text-sm">
                <span class="mr-2">⚠️</span>
                Wrong Network
              </div>
              
              <!-- Error Alert -->
              <div v-if="error" class="hidden md:block text-red-500 text-sm">
                {{ error }}
              </div>
              
              <button 
                v-if="!isConnected" 
                @click="connect"
                :disabled="isLoading"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center"
              >
                <span v-if="isLoading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                </span>
                {{ isLoading ? 'Connecting...' : 'Connect Wallet' }}
              </button>
              
              <div v-else class="flex items-center space-x-4">
                <!-- Network Indicator -->
                <span 
                  class="hidden md:inline-flex px-2 py-1 rounded-full text-xs"
                  :class="isCorrectChain ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
                >
                  {{ isCorrectChain ? 'Testnet' : 'Wrong Network' }}
                </span>
                
                <!-- Address and Balance -->
                <div class="flex items-center space-x-2">
                  <span class="bg-gray-700 rounded-lg px-4 py-2 font-mono text-sm">
                    {{ shortAddress }}
                  </span>
                  <span class="hidden md:inline-block text-green-400 text-sm">
                    {{ balanceDisplay }} ETH
                  </span>
                </div>
                
                <!-- Profile Dropdown -->
                <div class="relative">
                  <button 
                    @click="isProfileOpen = !isProfileOpen"
                    class="text-gray-300 hover:text-white"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div v-if="isProfileOpen"
                       class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div class="py-1">
                      <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</a>
                      <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">My Reports</a>
                      <button 
                        @click="disconnectWallet"
                        class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Mobile Menu (shown on small screens) -->
    <div class="md:hidden" v-show="isMobileMenuOpen">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.href"
          class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          :class="{ 'bg-gray-800': isCurrentRoute(item.href) }"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center">
          <div class="text-gray-400 text-sm">
            &copy; 2024 BugScout.ai. 
          </div>
          <div class="flex space-x-6">
            <p class="text-gray-400 hover:text-white">Discord and other channels, coming soon. Our product is great but our footer is a joke :)</p>
            <!-- <a href="#" class="text-gray-400 hover:text-white">
              Twitter
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              GitHub
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              Discord
            </a> -->
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWallet } from './composables/useWallet'

const router = useRouter()
const route = useRoute()

const {
  connect,
  disconnectWallet,
  address,
  balance,
  isConnected,
  isCorrectChain,
  error,
  isLoading
} = useWallet()

const isProfileOpen = ref(false)
const isMobileMenuOpen = ref(false)

const navigation = [
  { name: 'Analyze', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Reports', href: '/reports' },
]

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const balanceDisplay = computed(() => {
  if (!balance.value) return '0'
  return parseFloat(balance.value).toFixed(4)
})

function isCurrentRoute(path) {
  return route.path === path
}

// Close profile dropdown when clicking outside
function handleClickOutside(event) {
  if (isProfileOpen.value && !event.target.closest('.relative')) {
    isProfileOpen.value = false
  }
}

// Add click outside listener
window.addEventListener('click', handleClickOutside)
</script>

<style>
@import './assets/main.css';

.router-link-active {
  @apply bg-gray-800;
}
</style>