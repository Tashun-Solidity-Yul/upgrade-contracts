// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// import {ethers, upgrades }from "hardhat";
const { ethers, upgrades } = require('hardhat');
const hre = require("hardhat");

// npx hardhat run .\scripts\deployERC721.js --network goreli
// npx hardhat verify --network goreli 0x869fffdbd019bd9d5ce45f7430c4cbf2bee406a8
async function main() {

  const [signer] = await hre.ethers.getSigners()
  const ERC721Token = await ethers.getContractFactory("ERC721Token",signer);
  const erc721ContractProxy = await upgrades.deployProxy(ERC721Token, ["GAME", "GAM", signer.address], {
    initializer: "initialize",
  });
  await erc721ContractProxy.deployed()

  console.log("erc721ContractProxy : " + erc721ContractProxy.address);

  // await hre.run("verify:verify", {
  //   address: erc721ContractProxy.address,
  // });

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
