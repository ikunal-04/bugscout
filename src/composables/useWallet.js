import { ref, onMounted, onUnmounted } from 'vue';
import { ethers } from 'ethers';

const BASE_SEPOLIA_CONFIG = {
  chainId: '0x14a34', // 84531 in decimal
  chainName: 'Base Sepolia Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'], // Replace with your preferred RPC URL
  blockExplorerUrls: ['https://base-sepolia.blockscout.com'],
};

const BSC_TESTNET_CONFIG = {
  chainId: '0x61', // 97 in decimal
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'], // BSC Testnet RPC
  blockExplorerUrls: ['https://testnet.bscscan.com'],
};

const MOONBASE_CONFIG = {
  chainId: '0x507', // 1287 in decimal
  chainName: 'Moonbase Alpha Testnet',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'], // Moonbase RPC URL
  blockExplorerUrls: ['https://moonbase.moonscan.io'],
};

const CITREA_CONFIG = {
  chainId: '0x13fb', // 5115 in decimal
  chainName: 'Citrea Testnet',
  nativeCurrency: {
    name: 'CTR',
    symbol: 'CTR',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.citrea.xyz'],
  blockExplorerUrls: ['https://explorer.testnet.citrea.xyz'],
};

const MANTLE_CONFIG = {
  chainId: '0x138b', // 84017 in decimal
  chainName: 'Mantle Sepolia Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.mantle.xyz'], // Mantle Sepolia RPC URL
  blockExplorerUrls: ['https://explorer.testnet.mantle.xyz'], // Mantle Sepolia Block Explorer
};


export function useWallet() {
  const address = ref('');
  const balance = ref('0');
  const isConnected = ref(false);
  const isCorrectChain = ref(false);
  const error = ref('');
  const isLoading = ref(false);
  const currentNetwork = ref('base');

  // Enum-like object for networks
  const NETWORKS = {
    BASE_SEPOLIA: {
      config: BASE_SEPOLIA_CONFIG,
      name: 'base'
    },
    BSC_TESTNET: {
      config: BSC_TESTNET_CONFIG,
      name: 'bsc'
    },
    MOONBASE: {
      config: MOONBASE_CONFIG,
      name: 'moonbase'
    }, 
    CITREA: {
      config: CITREA_CONFIG,
      name: 'citrea'
    },
    MANTLE: {
      config: MANTLE_CONFIG,
      name: 'mantle'
    },
  };

  function resolveNetwork(preferredNetwork) {
    switch (preferredNetwork) {
      case 'bsc': return NETWORKS.BSC_TESTNET;
      case 'moonbase': return NETWORKS.MOONBASE;
      case 'citrea': return NETWORKS.CITREA;
      case 'mantle': return NETWORKS.MANTLE;
      default: return NETWORKS.BASE_SEPOLIA;
    }
  }

  async function checkChainId(network = NETWORKS.BASE_SEPOLIA) {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log(`Current Chain ID: ${chainId}, Expected: ${network.config.chainId}`);
      const isCorrect = chainId === network.config.chainId;
      isCorrectChain.value = isCorrect;
      if (isCorrect) currentNetwork.value = network.name;
      return isCorrect;
    } catch (err) {
      console.error('Error checking chain ID:', err);
      return false;
    }
  }  

  async function switchToChain(network = NETWORKS.BASE_SEPOLIA) {
    try {
      console.log(`Attempting to switch to ${network.name} with Chain ID: ${network.config.chainId}`);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.config.chainId }],
      });
      console.log(`Successfully switched to ${network.name}`);
      return true;
    } catch (switchError) {
      console.error(`Error switching to ${network.name} Chain:`, switchError);
      if (switchError.code === 4902) {
        try {
          console.log(`Attempting to add ${network.name} Chain`);
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network.config],
          });
          console.log(`${network.name} Chain added successfully`);
          return true;
        } catch (addError) {
          console.error(`Error adding ${network.name} Chain:`, addError);
          error.value = `Failed to add ${network.name} Chain to wallet`;
          return false;
        }
      }
      error.value = `Failed to switch to ${network.name} Chain`;
      return false;
    }
  }
  

  async function updateBalance(addr) {
    if (typeof window.ethereum !== 'undefined' && addr) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(addr);
        balance.value = ethers.formatEther(bal);
      } catch (err) {
        console.error('Error updating balance:', err);
        balance.value = '0';
      }
    }
  }

  async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          // Check if we were previously connected in this session
          const wasConnected = sessionStorage.getItem('walletConnected') === 'true';
          if (wasConnected) {
            // Try Base Sepolia first
            let isCorrectNetwork = await checkChainId(NETWORKS.BASE_SEPOLIA);

            // If not Base Sepolia, try BSC Testnet
            if (!isCorrectNetwork) {
              isCorrectNetwork = await checkChainId(NETWORKS.BSC_TESTNET);
            }

            // If not BSC Testnet, try Moonbase
            if (!isCorrectNetwork) {
              isCorrectNetwork = await checkChainId(NETWORKS.MOONBASE);
            }

            if (!isCorrectNetwork) {
              // If not Moonbase, try Citrea Testnet
              isCorrectNetwork = await checkChainId(NETWORKS.CITREA);
            }

            if (!isCorrectNetwork) {
              isCorrectNetwork = await checkChainId(NETWORKS.MANTLE);
            }

            if (isCorrectNetwork) {
              address.value = accounts[0].address;
              await updateBalance(accounts[0].address);
              isConnected.value = true;
              isCorrectChain.value = true;
            } else {
              // Don't auto-connect if on the wrong network
              sessionStorage.removeItem('walletConnected');
            }
          }
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      }
    }
  }

  async function handleAccountsChanged(accounts) {
    console.log('Accounts changed:', accounts);
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else if (accounts[0] !== address.value) {
      // User switched to a different account
      address.value = accounts[0];
      await updateBalance(accounts[0]);
      isConnected.value = true;
    }
  }

  async function handleChainChanged(chainId) {
    console.log(`Chain changed to: ${chainId}`);
    // Check if the chainId matches Base Sepolia, BSC Testnet, or Moonbase
    let isCorrectNetwork = false;

    if (chainId === NETWORKS.BASE_SEPOLIA.config.chainId) {
      isCorrectNetwork = true;
      currentNetwork.value = NETWORKS.BASE_SEPOLIA.name;
    } else if (chainId === NETWORKS.BSC_TESTNET.config.chainId) {
      isCorrectNetwork = true;
      currentNetwork.value = NETWORKS.BSC_TESTNET.name;
    } else if (chainId === NETWORKS.MOONBASE.config.chainId) {
      isCorrectNetwork = true;
      currentNetwork.value = NETWORKS.MOONBASE.name;
    } else if (chainId === NETWORKS.CITREA.config.chainId) {
      isCorrectNetwork = true;
      currentNetwork.value = NETWORKS.CITREA.name;
    } else if (chainId === NETWORKS.MANTLE.config.chainId) {
      isCorrectNetwork = true;
      currentNetwork.value = NETWORKS.MANTLE.name;
    }

    isCorrectChain.value = isCorrectNetwork;

    if (!isCorrectNetwork && isConnected.value) {
      error.value = 'Please switch to Base Sepolia, BSC Testnet, or Moonbase Testnet or Citrea Testnet';
    } else {
      error.value = '';
    }

    // Reload the page to avoid any state inconsistencies
    window.location.reload();
  }

  async function connect(preferredNetwork = 'base') {
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask is not installed.');
      error.value = 'Please install MetaMask!';
      return;
    }
  
    console.log('Connecting wallet...');
    isLoading.value = true;
    error.value = '';
  
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts requested successfully.');
  
      const network = resolveNetwork(preferredNetwork);
      console.log(`Resolved network: ${network.name} (${network.config.chainId})`);
  
      let isCorrectNetwork = await checkChainId(network);
      if (!isCorrectNetwork) {
        console.log(`Switching to the ${network.name} network.`);
        const switched = await switchToChain(network);
        if (!switched) {
          throw new Error(`Failed to switch to ${network.name} Chain`);
        }
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      console.log(`Connected wallet address: ${addr}`);
  
      address.value = addr;
      await updateBalance(addr);
      isConnected.value = true;
      isCorrectChain.value = true;
      currentNetwork.value = network.name;
  
      sessionStorage.setItem('walletConnected', 'true');
      console.log('Wallet connection state saved.');
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      error.value = err.message || 'Failed to connect wallet';
      disconnectWallet();
    } finally {
      isLoading.value = false;
    }
  }
  

  function disconnectWallet() {
    isConnected.value = false;
    isCorrectChain.value = false;
    address.value = '';
    balance.value = '0';
    error.value = '';
    currentNetwork.value = 'base';
    sessionStorage.removeItem('walletConnected');
  }

  // Setup event listeners
  onMounted(() => {
    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  });

  // Cleanup event listeners
  onUnmounted(() => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  });

  return {
    connect,
    disconnectWallet,
    address,
    balance,
    isConnected,
    isCorrectChain,
    error,
    isLoading,
    currentNetwork,
    NETWORKS,
  };
}