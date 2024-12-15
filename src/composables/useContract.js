import { ref } from 'vue'
import { ethers } from 'ethers'
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk"
import { useWallet } from './useWallet'
import abi from '../abi.json'

const CONTRACT_CONFIGS = {
  84532: {
    address: '0x580766a5F69DcdAc5422c3dDAC977D11b3e65c49',
    abi: abi.abi
  },
  97: {
    address: '0xe4B0D5ee6C298B202e2B74CFc5275358A379A5C1',
    abi: abi.abi
  },
  1287: {
    address: '0x4174C72de549c9482170aDFea4c655738323DA74',
    abi: abi.abi
  },
  5115: {
    address: '0x3EBB4D4868b28d49fb41578bBB2314a68c098d8f',
    abi: abi.abi
  },
  5003: {
    address: '0xe4B0D5ee6C298B202e2B74CFc5275358A379A5C1',
    abi: abi.abi
  }
}

const EAS_CONFIGS = {
  84532: {
    contractAddress: "0x4200000000000000000000000000000000000021",
    schemaUID: "0x27aef44562ff59c454c0f89630dd5fbe8c5b66a07a999060443de311b0c0cdb4"
  },
}

export function useContract() {
  const { provider, address, isConnected, isCorrectChain } = useWallet()
  const contract = ref(null)
  const easContract = ref(null)
  const isLoading = ref(false)
  const error = ref('')
  const txHash = ref('')

  async function getContract() {
    if (!window.ethereum) {
      throw new Error('No wallet detected');
    }
  
    if (!isConnected.value) {
      throw new Error('Wallet not connected');
    }
  
    // Retrieve chainId from the wallet
    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    const network = await ethersProvider.getNetwork();
    const chainId = Number(network.chainId);
    console.log('chainId', chainId);
  
    // Update supported chains to include Citrea Testnet
    const supportedChains = [84532, 97, 1287, 5115, 5003];
    if (!supportedChains.includes(chainId)) {
      throw new Error('Please switch to Base Sepolia, BSC Testnet, Moonbase Alpha, or Citrea Testnet');
    }
  
    const currentConfig = CONTRACT_CONFIGS[chainId];
    if (!currentConfig) {
      throw new Error('Unsupported network');
    }
  
    try {
      const signer = await ethersProvider.getSigner();
      contract.value = new ethers.Contract(
        currentConfig.address,
        currentConfig.abi,
        signer
      );

      if (EAS_CONFIGS[chainId]) {
        const easConfig = EAS_CONFIGS[chainId];
        const eas = new EAS(easConfig.contractAddress);
        await eas.connect(signer);
        easContract.value = { eas, schemaUID: easConfig.schemaUID };
      }

      return contract.value;
    } catch (err) {
      console.error('Error initializing contract:', err);
      throw new Error('Failed to initialize contract');
    }
  }
  

  async function submitReport({ contractAddress, riskScore, issues, suggestions }) {
    isLoading.value = true;
    error.value = '';
    txHash.value = '';

    const PUBLISHER = "https://publisher.walrus-testnet.walrus.space"; // Replace with your desired Walrus publisher URL

    try {
      const contract = await getContract();

      // Create report data
      const reportData = {
        timestamp: Date.now(),
        contractAddress,
        riskScore,
        issues,
        suggestions,
        auditor: address.value,
      };

      // Convert report data to JSON string
      const reportDataString = JSON.stringify(reportData);

      // Submit the report to Walrus Publisher
      const walrusResponse = await fetch(`${PUBLISHER}/v1/store`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: reportDataString,
      });

      if (!walrusResponse.ok) {
        throw new Error(`Failed to store report on Walrus: ${walrusResponse.statusText}`);
      }

      const walrusResult = await walrusResponse.json();
      const blobId = walrusResult.newlyCreated?.blobObject?.blobId;

      if (!blobId) {
        throw new Error("Walrus did not return a valid blob ID.");
      }

      let attestationUID = null;
      if (easContract.value) {
        try {
          // Initialize SchemaEncoder with the schema string
          const schemaEncoder = new SchemaEncoder("string[] IssueSummary");
          
          // Encode the issues as an array of strings
          const encodedData = schemaEncoder.encodeData(
            issues.map(issue => ({
              name: "IssueDetails",
              value: [
                { name: "title", value: issue.title, type: "string" },
                { name: "description", value: issue.description, type: "string" }
              ],
              type: "(string,string)[]"
            }))
          );

          // Perform EAS Attestation
          const tx = await easContract.value.eas.attest({
            schema: easContract.value.schemaUID,
            data: {
              recipient: contractAddress, // Attest to the contract being audited
              expirationTime: 0, // No expiration
              revocable: true,
              data: encodedData,
            },
          });

          const attestationReceipt = await tx.wait();
          attestationUID = attestationReceipt.logs[0].args[1]; // Assuming first log contains the attestation UID
        } catch (easError) {
          console.warn("EAS Attestation failed:", easError);
        }
      }

      try {
        // Estimate gas
        const gasEstimate = await contract.submitReport.estimateGas(contractAddress, blobId, riskScore);

        // Add 20% buffer to gas estimate using BigInt math
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);

        // Submit to blockchain
        const tx = await contract.submitReport(contractAddress, blobId, riskScore, { gasLimit });

        txHash.value = tx.hash;

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        // txHash.value = blobId;
        console.log(blobId);
        return {
          success: true,
          receipt,
          reportData,
          blobId,
        };
      } catch (gasError) {
        // If gas estimation fails, try without gas limit
        console.warn("Gas estimation failed, trying without gas limit:", gasError);

        const tx = await contract.submitReport(contractAddress, blobId, riskScore);

        txHash.value = tx.blobId;

        const receipt = await tx.wait();
        // console.log(blobId);

        return {
          success: true,
          receipt,
          reportData,
          blobId,
        };
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      error.value = err.message || "Failed to submit report";
      return {
        success: false,
        error: err.message,
      };
    } finally {
      isLoading.value = false;
    }
  }

  // Rest of your existing functions remain the same...
  async function getReports(contractAddress) {
  error.value = '';

  const PUBLISHER = "https://publisher.walrus-testnet.walrus.space"; 

  try {
    const contract = await getContract();
    const reports = await contract.getReports(contractAddress);

    // Fetch the report data from Walrus for each blob ID
    const formattedReports = await Promise.all(
      reports.map(async (report) => {
        const blobId = report.ipfsHash; // Use ipfsHash as blobId
        let reportData;

        try {
          const walrusResponse = await fetch(`${PUBLISHER}/v1/fetch/${blobId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!walrusResponse.ok) {
            throw new Error(`Failed to fetch report from Walrus: ${walrusResponse.statusText}`);
          }

          reportData = await walrusResponse.json();
        } catch (fetchError) {
          console.warn(`Failed to fetch Walrus report for blob ID ${blobId}:`, fetchError);
          reportData = null; // If fetch fails, keep null as report data
        }

        return {
          contractAddress: report.contractAddress,
          blobId, // Formerly ipfsHash
          riskScore: Number(report.riskScore),
          timestamp: Number(report.timestamp),
          auditor: report.auditor,
          isVerified: report.isVerified,
          reportData, // Include the fetched data if available
        };
      })
    );

    return formattedReports;
  } catch (err) {
    console.error('Error getting reports:', err);
    error.value = err.message || 'Failed to fetch reports';
    throw err;
  }
}


  async function getAuditorDetails(auditorAddress) {
    error.value = ''

    try {
      const contract = await getContract()
      const details = await contract.getAuditorDetails(auditorAddress || address.value)

      return {
        isActive: details.isActive,
        reportsSubmitted: Number(details.reportsSubmitted),
        reputation: Number(details.reputation)
      }
    } catch (err) {
      console.error('Error getting auditor details:', err)
      error.value = err.message || 'Failed to fetch auditor details'
      throw err
    }
  }

  async function verifyReport(contractAddress, reportIndex) {
    isLoading.value = true
    error.value = ''
    txHash.value = ''

    try {
      const contract = await getContract()

      // Estimate gas
      const gasEstimate = await contract.verifyReport.estimateGas(
        contractAddress,
        reportIndex
      )
      const gasLimit = gasEstimate.mul(120).div(100)

      const tx = await contract.verifyReport(
        contractAddress,
        reportIndex,
        { gasLimit }
      )

      txHash.value = tx.hash
      const receipt = await tx.wait()

      return {
        success: true,
        receipt
      }

    } catch (err) {
      console.error('Error verifying report:', err)
      error.value = err.message || 'Failed to verify report'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addAuditor(auditorAddress) {
    isLoading.value = true
    error.value = ''
    txHash.value = ''

    try {
      const contract = await getContract()
      const tx = await contract.addAuditor(auditorAddress)
      txHash.value = tx.hash
      await tx.wait()
      return true
    } catch (err) {
      console.error('Error adding auditor:', err)
      error.value = err.message || 'Failed to add auditor'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateAuditorReputation(auditorAddress, newReputation) {
    isLoading.value = true
    error.value = ''
    txHash.value = ''

    try {
      const contract = await getContract()
      const tx = await contract.updateAuditorReputation(auditorAddress, newReputation)
      txHash.value = tx.hash
      await tx.wait()
      return true
    } catch (err) {
      console.error('Error updating reputation:', err)
      error.value = err.message || 'Failed to update reputation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    submitReport,
    getReports,
    getAuditorDetails,
    verifyReport,
    addAuditor,
    updateAuditorReputation,
    isLoading,
    error,
    txHash,
  }
}