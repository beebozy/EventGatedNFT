import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Event Contract", function () {
  async function deployEvent() {
    const [owner, otherAccount, thirdAccount] = await hre.ethers.getSigners();
    const NFT = await hre.ethers.getContractFactory("NFT");
    const nftToken = await NFT.deploy(); // Deploy the NFT contract first

    const EventContract = await hre.ethers.getContractFactory("Event");
    const eventContractDeploy = await EventContract.deploy(); // Deploy the Event contract
    //await eventContractDeploy.deployed();

    return { owner, otherAccount, thirdAccount, eventContractDeploy, nftToken };
  }

  describe("Deployment", function () {
    it("should set the owner correctly", async function () {
      const { owner, eventContractDeploy } = await loadFixture(deployEvent);

      // Check if the owner is set correctly
      expect(await eventContractDeploy.owner()).to.equal(owner.address);
    });
  });

  describe("Event Creation", function () {
    it("should create an event successfully", async function () {
      const { owner, eventContractDeploy, nftToken } = await loadFixture(deployEvent);

      // Create an event
      await expect(eventContractDeploy.connect(owner).createEvent(nftToken, "Test Event"))
        .to.emit(eventContractDeploy, "EventRegistered") // Ensure the event emits correctly
        .withArgs(nftToken, 1);

      // Check the details of the created event
      const eventData = await eventContractDeploy.events(0);
      expect(eventData.name).to.equal("Test Event");
      expect(eventData.isCreated).to.be.true;
      expect(eventData.acceptableAdresses).to.equal(nftToken);
    });

    it("should fail to create an event if not the owner", async function () {
      const { otherAccount, eventContractDeploy, nftToken } = await loadFixture(deployEvent);

      // Other accounts should not be able to create events
      await expect(
        eventContractDeploy.connect(otherAccount).createEvent(nftToken, "Invalid Event")
      ).to.be.revertedWith("Not an owner");
    });
  });

  describe("Event Registration", function () {
    /*it("should allow valid users to register for an event", async function () {
      const { owner, otherAccount, eventContractDeploy, nftToken } = await loadFixture(deployEvent);

      // Mint NFT to the otherAccount for eligibility
      await nftToken.mint(otherAccount.address, "https://token-uri.com");

      // Create an event
      await eventContractDeploy.connect(owner).createEvent(nftToken.address, "Test Event");

      // Register the otherAccount for the event
      await expect(eventContractDeploy.connect(otherAccount).registerEvent(otherAccount.address))
        .to.emit(eventContractDeploy, "EVentBooked")
        .withArgs(otherAccount.address, 1);
    }); */

    it("should fail to register if the user does not own an NFT", async function () {
      const { otherAccount, eventContractDeploy, nftToken } = await loadFixture(deployEvent);

      // Other accounts without NFT should fail to register
      await expect(
        eventContractDeploy.connect(otherAccount).registerEvent(otherAccount.address)
      ).to.be.revertedWith("You must have an ERC721");
    });
  });

  describe("Event Removal", function () {
    it("should allow the owner to remove an event", async function () {
      const { owner, eventContractDeploy, nftToken } = await loadFixture(deployEvent);

      // Create an event
      await eventContractDeploy.connect(owner).createEvent(nftToken, "Test Event");

      // Remove the event
      await expect(eventContractDeploy.connect(owner).removeEvent(nftToken))
        .to.emit(eventContractDeploy, "EventRemoved")
        .withArgs(nftToken, 1);
    });

    it("should fail to remove an event by non-owner", async function () {
      const { otherAccount, eventContractDeploy, nftToken } = await loadFixture(deployEvent);

      // Non-owner should not be able to remove an event
      await expect(
        eventContractDeploy.connect(otherAccount).removeEvent(nftToken)
      ).to.be.revertedWith("Not an owner");
    });
  });
});
