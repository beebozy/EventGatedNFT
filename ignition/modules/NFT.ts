import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTModule = buildModule("NFTModule", (m) => {

    const erc20 = m.contract("NFT");

    return { erc20 };
});

export default NFTModule;

// NFTModule#NFT - 0x9EA05C349a78031C736Fc9F91348f1078a0831D3

// - https://sepolia-blockscout.lisk.com//address/0x9EA05C349a78031C736Fc9F91348f1078a0831D3#code