const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BugHuntr", function () {
  let BugHuntr;
  let bugHuntr;
  let owner;
  let auditor;
  let user;

  beforeEach(async function () {
    // Get signers
    [owner, auditor, user] = await ethers.getSigners();
    
    // Get contract factory
    BugHuntr = await ethers.getContractFactory("BugHuntr");
    
    // Deploy contract and wait for deployment
    bugHuntr = await BugHuntr.deploy();
    await bugHuntr.waitForDeployment(); // Updated for latest ethers
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await bugHuntr.owner()).to.equal(owner.address);
    });

    it("Should make deployer an auditor", async function () {
      const auditorDetails = await bugHuntr.getAuditorDetails(owner.address);
      expect(auditorDetails.isActive).to.equal(true);
      expect(auditorDetails.reputation).to.equal(100);
    });
  });

  describe("Auditor Management", function () {
    it("Should add new auditor", async function () {
      await bugHuntr.addAuditor(auditor.address);
      const auditorDetails = await bugHuntr.getAuditorDetails(auditor.address);
      expect(auditorDetails.isActive).to.equal(true);
    });

    it("Should remove auditor", async function () {
      await bugHuntr.addAuditor(auditor.address);
      await bugHuntr.removeAuditor(auditor.address);
      const auditorDetails = await bugHuntr.getAuditorDetails(auditor.address);
      expect(auditorDetails.isActive).to.equal(false);
    });
  });

  describe("Report Submission", function () {
    beforeEach(async function () {
      await bugHuntr.addAuditor(auditor.address);
    });

    it("Should submit report", async function () {
      const tx = await bugHuntr.connect(auditor).submitReport(
        user.address,
        "QmTest123",
        80
      );

      await expect(tx)
        .to.emit(bugHuntr, "ReportSubmitted")
        .withArgs(user.address, "QmTest123", 80);

      const reports = await bugHuntr.getReports(user.address);
      expect(reports.length).to.equal(1);
      expect(reports[0].riskScore).to.equal(80);
    });

    it("Should prevent duplicate reports", async function () {
      await bugHuntr.connect(auditor).submitReport(
        user.address,
        "QmTest123",
        80
      );

      await expect(
        bugHuntr.connect(auditor).submitReport(
          user.address,
          "QmTest123",
          80
        )
      ).to.be.revertedWith("Duplicate report");
    });
  });

  describe("Report Verification", function () {
    beforeEach(async function () {
      await bugHuntr.addAuditor(auditor.address);
      await bugHuntr.connect(auditor).submitReport(
        user.address,
        "QmTest123",
        80
      );
    });

    it("Should verify report", async function () {
      const tx = await bugHuntr.verifyReport(user.address, 0);
      
      await expect(tx)
        .to.emit(bugHuntr, "ReportVerified")
        .withArgs(user.address, "QmTest123");

      const reports = await bugHuntr.getReports(user.address);
      expect(reports[0].isVerified).to.equal(true);
    });

    it("Should not allow double verification", async function () {
      await bugHuntr.verifyReport(user.address, 0);
      await expect(
        bugHuntr.verifyReport(user.address, 0)
      ).to.be.revertedWith("Report already verified");
    });
  });

  describe("Reputation System", function () {
    it("Should update auditor reputation", async function () {
      await bugHuntr.addAuditor(auditor.address);
      await bugHuntr.updateAuditorReputation(auditor.address, 90);
      
      const auditorDetails = await bugHuntr.getAuditorDetails(auditor.address);
      expect(auditorDetails.reputation).to.equal(90);
    });

    it("Should prevent low reputation auditors from submitting reports", async function () {
      await bugHuntr.addAuditor(auditor.address);
      await bugHuntr.updateAuditorReputation(auditor.address, 40); // Below threshold
      
      await expect(
        bugHuntr.connect(auditor).submitReport(
          user.address,
          "QmTest123",
          80
        )
      ).to.be.revertedWith("Insufficient reputation");
    });
  });
});