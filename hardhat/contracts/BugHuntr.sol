// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Simplified imports to avoid potential path issues
import "@openzeppelin/contracts/access/Ownable.sol";

contract BugHuntr is Ownable {
    struct Report {
        address contractAddress;
        string ipfsHash;       // Detailed analysis report
        uint256 riskScore;     // 0-100
        uint256 timestamp;
        address auditor;
        bool isVerified;
    }
    
    struct Auditor {
        bool isActive;
        uint256 reportsSubmitted;
        uint256 reputation;    // 0-100
    }
    
    mapping(address => Report[]) public contractReports;
    mapping(address => Auditor) public auditors;
    mapping(address => mapping(bytes32 => bool)) public reportHashes; // Prevents duplicate reports
    
    uint256 public reportCount;
    uint256 public minReputationThreshold = 50;
    
    event ReportSubmitted(address indexed contractAddress, string ipfsHash, uint256 riskScore);
    event AuditorStatusChanged(address indexed auditor, bool isActive);
    event ReportVerified(address indexed contractAddress, string ipfsHash);
    
    modifier onlyAuditor() {
        require(auditors[msg.sender].isActive, "Not an active auditor");
        require(auditors[msg.sender].reputation >= minReputationThreshold, "Insufficient reputation");
        _;
    }
    
    constructor() {
        // Initialize contract owner as first auditor
        auditors[msg.sender] = Auditor({
            isActive: true,
            reportsSubmitted: 0,
            reputation: 100
        });
        emit AuditorStatusChanged(msg.sender, true);
    }
    
    function submitReport(
        address _contractAddress,
        string memory _ipfsHash,
        uint256 _riskScore
    ) external onlyAuditor {
        require(_riskScore <= 100, "Invalid risk score");
        
        // Create unique hash for this report
        bytes32 reportHash = keccak256(abi.encodePacked(_contractAddress, _ipfsHash));
        require(!reportHashes[_contractAddress][reportHash], "Duplicate report");
        
        Report memory newReport = Report({
            contractAddress: _contractAddress,
            ipfsHash: _ipfsHash,
            riskScore: _riskScore,
            timestamp: block.timestamp,
            auditor: msg.sender,
            isVerified: false
        });
        
        contractReports[_contractAddress].push(newReport);
        reportHashes[_contractAddress][reportHash] = true;
        auditors[msg.sender].reportsSubmitted++;
        reportCount++;
        
        emit ReportSubmitted(_contractAddress, _ipfsHash, _riskScore);
    }
    
    function getReports(address _contractAddress) external view returns (Report[] memory) {
        return contractReports[_contractAddress];
    }
    
    function addAuditor(address _auditor) external onlyOwner {
        require(!auditors[_auditor].isActive, "Already an auditor");
        auditors[_auditor] = Auditor({
            isActive: true,
            reportsSubmitted: 0,
            reputation: 70  // Initial reputation score
        });
        emit AuditorStatusChanged(_auditor, true);
    }
    
    function removeAuditor(address _auditor) external onlyOwner {
        require(auditors[_auditor].isActive, "Not an active auditor");
        auditors[_auditor].isActive = false;
        emit AuditorStatusChanged(_auditor, false);
    }
    
    function updateAuditorReputation(address _auditor, uint256 _newReputation) external onlyOwner {
        require(_newReputation <= 100, "Invalid reputation score");
        require(auditors[_auditor].isActive, "Not an active auditor");
        auditors[_auditor].reputation = _newReputation;
    }
    
    function verifyReport(address _contractAddress, uint256 _reportIndex) external onlyOwner {
        require(_reportIndex < contractReports[_contractAddress].length, "Invalid report index");
        Report storage report = contractReports[_contractAddress][_reportIndex];
        require(!report.isVerified, "Report already verified");
        
        report.isVerified = true;
        emit ReportVerified(_contractAddress, report.ipfsHash);
    }
    
    function updateMinReputationThreshold(uint256 _newThreshold) external onlyOwner {
        require(_newThreshold <= 100, "Invalid threshold");
        minReputationThreshold = _newThreshold;
    }
    
    function getAuditorDetails(address _auditor) external view returns (Auditor memory) {
        return auditors[_auditor];
    }
}
