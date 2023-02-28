// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

// import {ethers, upgrades }from "hardhat";
const hre = require('hardhat')
const { ethers, upgrades } = require('hardhat');
// authoritativeToken : 0xaEB84da89F8654Be192FA59289Ba6BbFa340a71E
// npx hardhat run .\scripts\deployAuthoritativeToken.js --network goreli
// npx hardhat verify --network goreli 0xeB71f489CF795BEcD8Cdd3A0AFDf45307F087561

async function main() {

  const erc20ContractProxyAddress= "0x90a71747814B2DE1D1250051f5Eed171AA365Df9";
  const erc721ContractProxyAddress= "0x53c10175cFf64a3b88C0c769432CEbfAAB709779";
  const [signer] = await hre.ethers.getSigners()
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token", signer);
  const ERC721Token = await ethers.getContractFactory("ERC721Token",signer);
  const AuthoritativeToken = await ethers.getContractFactory("AuthoritativeToken",signer);
  const authoritativeToken = await upgrades.deployProxy(AuthoritativeToken, [erc721ContractProxyAddress, erc20ContractProxyAddress, signer.address], {
    initializer: "initialize",
  });
  await authoritativeToken.deployed()
  console.log("authoritativeToken : " + authoritativeToken.address);

  await hre.run("verify:verify", {
    address: authoritativeToken.address,
  });


  const erc721ContractProxyWithABISupport = await ERC721Token.attach(erc721ContractProxyAddress);
  const erc20ContractProxyWithABISupport = await ERC20Token.attach(erc20ContractProxyAddress);

  const tnx1 = await erc721ContractProxyWithABISupport.connect(signer).setupExecutiveRole(authoritativeToken.address);
  await tnx1.wait()
  const tnx2 = await erc20ContractProxyWithABISupport.connect(signer).setupExecutiveRole(authoritativeToken.address);
  await tnx2.wait()

  // const ERC721WithGodMod = await ethers.getContractFactory("ERC721WithGodMod");
  //
  // const eRC721WithGodMod = await upgrades.upgradeProxy(erc721ContractProxy.address, ERC721WithGodMod);
  // await eRC721WithGodMod.deployed();

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
