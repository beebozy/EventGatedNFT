import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import exp from "constants";
import hre, { ethers } from "hardhat";

describe("Event contract", function () {

  // Fixture to deploy the NFT contract
  async function deployToken() {
    const tokenFactory = await hre.ethers.getContractFactory("NFT");
    const deploytoken = await tokenFactory.deploy(); // Deploy the NFT contract
   // await deployToken.deployed(); // Ensure the deployment completes

    return { deploytoken };
  }

  // Fixture to deploy the Event contract
  async function deployContract() {
    const [owner, otherAddress] = await hre.ethers.getSigners();
    const { deploytoken } = await loadFixture(deployToken); // Load the token fixture
    const eventFactory = await hre.ethers.getContractFactory("Event");
    const deployEventContract = await eventFactory.deploy(); // Deploy the Event contract
    //await deployEventContract.deployed(); // Ensure the deployment completes

    return { owner, otherAddress, deployEventContract, deploytoken };
  }

  // Test the deployment
  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      const { owner, deployEventContract } = await loadFixture(deployContract);

      // Check that the owner variable in the contract is set correctly
      expect(await deployEventContract.owner()).to.equal(owner.address);
    });
    it("should set the number of event ", async function (){
      const {deployEventContract}= await loadFixture(deployContract);
      // it should set the event number to zer0
      expect(await deployEventContract.eventNumbers()).to.equal(0);

    });
  });

  describe ("Create Event", function(){
    it("It should not return adddress zero", async function(){
      const{deployEventContract,deploytoken,owner}= await loadFixture(deployContract);

    await  expect( deployEventContract.createEvent(ethers.ZeroAddress,"nft event")).to.be.revertedWith("Can't be a valid token");
    });
    it("It should emit an Event", async function () {
      
      const{deploytoken,deployEventContract}= await loadFixture(deployContract);
      await expect( deployEventContract.createEvent(deploytoken,"nft Event")).to.emit(deployEventContract,"EventRegistered").withArgs(deploytoken,1);
    });
  })

  describe ("Register event", function(){
    it("It should not return address zero", 
      async function (){
        
        const{deployEventContract}=await loadFixture(deployContract);
       await expect  (deployEventContract.registerEvent(ethers.ZeroAddress)).to.be.revertedWith("Not in the pool");
      
    });
    it("Should check if registration are met", async function () {
      const {owner,deploytoken,deployEventContract}=await loadFixture(deployContract);
      
     // const eventNumber= deployEventContract.eventNumbers();
// Mint an ERC721 token to the owner (nftAddressOfAttendee)
await deploytoken.mint(owner, "1"); // Mint token ID 1 to owner
// Check that the owner has the ERC721 token
const balanceERC721 = await deploytoken.balanceOf(owner);
expect(balanceERC721).to.equal(1);

  })
  })
})
  // 
  /*describe("Event Registration", function(){
    it("should return the event numbers", async function () {
      const{deployEventContract,deploytoken}= await loadFixture(deployContract);
      
      
    })
      
  })*/
  

