<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Smart Contract Reports</h1>
      <div class="flex space-x-4">
        <!-- Filter Dropdown -->
        <select 
          v-model="selectedFilter"
          class="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2"
        >
          <option value="all">All Reports</option>
          <option value="verified">Verified Only</option>
          <option value="unverified">Unverified Only</option>
          <option value="high-risk">High Risk</option>
        </select>

        <!-- Search Input -->
        <div class="relative">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Search by address..."
            class="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-2 w-64"
          >
          <svg 
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Reports Table -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contract Address
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Risk Score
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Auditor
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-mono text-sm">{{ shortenAddress(report.contractAddress) }}</span>
                  <button @click="copyAddress(report.contractAddress)" class="ml-2 text-gray-400 hover:text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div :class="{
                  'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center': true,
                  'bg-red-900 text-red-200': report.riskScore >= 70,
                  'bg-yellow-900 text-yellow-200': report.riskScore >= 30 && report.riskScore < 70,
                  'bg-green-900 text-green-200': report.riskScore < 30
                }">
                  {{ report.riskScore }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">
                {{ shortenAddress(report.auditor) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-green-900 text-green-200': report.isVerified,
                  'bg-gray-600 text-gray-200': !report.isVerified
                }">
                  {{ report.isVerified ? 'Verified' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ formatDate(report.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  @click="viewReport(report)"
                  class="text-blue-400 hover:text-blue-300"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-400">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalReports }} reports
      </div>
      <div class="flex space-x-2">
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Report Details Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/75" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 mb-4">
                  Report Details
                </DialogTitle>

                <div v-if="selectedReport" class="space-y-4">
                  <div class="bg-gray-700 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-400 mb-1">Contract Address</h4>
                    <div class="font-mono">{{ selectedReport.contractAddress }}</div>
                  </div>

                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-700 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-400 mb-1">Risk Score</h4>
                      <div class="text-2xl font-bold">{{ selectedReport.riskScore }}</div>
                    </div>
                    <div class="bg-gray-700 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-400 mb-1">Status</h4>
                      <div>{{ selectedReport.isVerified ? 'Verified' : 'Pending' }}</div>
                    </div>
                    <div class="bg-gray-700 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-400 mb-1">Date</h4>
                      <div>{{ formatDate(selectedReport.timestamp) }}</div>
                    </div>
                  </div>

                  <div class="bg-gray-700 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-400 mb-2">Issues Found</h4>
                    <div class="space-y-2">
                      <div v-for="(issue, index) in selectedReport.issues" :key="index"
                           class="bg-gray-600 rounded p-3">
                        <div class="font-medium mb-1">{{ issue.title }}</div>
                        <div class="text-sm text-gray-300">{{ issue.description }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-700 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-400 mb-2">Suggestions</h4>
                    <div class="space-y-2">
                      <div v-for="(suggestion, index) in selectedReport.suggestions" :key="index"
                           class="bg-gray-600 rounded p-3">
                        <div class="font-medium mb-1">{{ suggestion.title }}</div>
                        <div class="text-sm text-gray-300">{{ suggestion.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    @click="closeModal"
                    class="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContract } from '../composables/useContract'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const { getReports } = useContract()

// State
const reports = ref([])
const selectedFilter = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 10
const isModalOpen = ref(false)
const selectedReport = ref(null)

// Load reports
async function loadReports() {
  try {
    reports.value = await getReports()
  } catch (error) {
    console.error('Error loading reports:', error)
  }
}

// Filter and search computed
const filteredReports = computed(() => {
  let filtered = [...reports.value]

  // Apply filter
  if (selectedFilter.value !== 'all') {
    switch (selectedFilter.value) {
      case 'verified':
        filtered = filtered.filter(r => r.isVerified)
        break
      case 'unverified':
        filtered = filtered.filter(r => !r.isVerified)
        break
      case 'high-risk':
        filtered = filtered.filter(r => r.riskScore >= 70)
        break
    }
  }

  // Apply search
  if (searchQuery.value) {
    filtered = filtered.filter(r => 
      r.contractAddress.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.auditor.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

// Pagination
const totalReports = computed(() => filteredReports.value.length)
const totalPages = computed(() => Math.ceil(totalReports.value / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, totalReports.value))
const paginatedReports = computed(() => {
  return filteredReports.value.slice(startIndex.value, endIndex.value)
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Utilities
function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString()
}

async function copyAddress(address) {
  try {
    await navigator.clipboard.writeText(address)
    // Could add a toast notification here
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

function viewReport(report) {
  selectedReport.value = report
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedReport.value = null
}

// Load initial data
loadReports()
</script>