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

async function deployAuthoritativeTokenUsingTransparentProxyPattern() {

  const erc20ContractProxyAddress= "0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650";
  const erc721ContractProxyAddress= "0x927b167526bAbB9be047421db732C663a0b77B11";
  const [signer] = await hre.ethers.getSigners()
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token", signer);
  const ERC721Token = await ethers.getContractFactory("ERC721Token",signer);
  const AuthoritativeToken = await ethers.getContractFactory("AuthoritativeToken",signer);
  const authoritativeTokenProxy = await upgrades.deployProxy(AuthoritativeToken, [erc721ContractProxyAddress, erc20ContractProxyAddress, signer.address], {
    initializer: "initialize",
  });
  await authoritativeTokenProxy.deployed()
  console.log("authoritativeTokenProxy : " + authoritativeTokenProxy.address);

  // await hre.run("verify:verify", {
  //   address: authoritativeToken.address,
  // });


  const erc721ContractProxyWithABISupport = await ERC721Token.attach(erc721ContractProxyAddress);
  const erc20ContractProxyWithABISupport = await ERC20Token.attach(erc20ContractProxyAddress);
  const authoritativeContractProxyWithABISupport = await AuthoritativeToken.attach(
      authoritativeTokenProxy.address,
  );

  const tnx1 = await erc721ContractProxyWithABISupport.connect(signer).setupExecutiveRole(authoritativeTokenProxy.address);
  await tnx1.wait();
  const tnx2 = await erc20ContractProxyWithABISupport.connect(signer).setupExecutiveRole(authoritativeTokenProxy.address);
  await tnx2.wait();

  // const ERC721WithGodMod = await ethers.getContractFactory("ERC721WithGodMod");
  //
  // const eRC721WithGodMod = await upgrades.upgradeProxy(erc721ContractProxy.address, ERC721WithGodMod);
  // await eRC721WithGodMod.deployed();


  // console.log(await erc721ContractProxyWithABISupport.OWNER_ROLE())
  // console.log(
  //     await erc721ContractProxyWithABISupport.getRoleAdmin(
  //         await authoritativeContractProxyWithABISupport.OWNER_ROLE(),
  //     ),
  // )
  // console.log(
  //     await erc721ContractProxyWithABISupport.hasRole(
  //         await authoritativeContractProxyWithABISupport.OWNER_ROLE(),
  //         signer.address,
  //     ),
  // )
  // await erc721ContractProxyWithABISupport.mintNewNFTThroughContract(signer.address)
  const tnx3 = await erc20ContractProxyWithABISupport
      .connect(signer)
      .approve(authoritativeTokenProxy.address, 10n ** 17n)
  await tnx3.wait()
  console.log(await erc20ContractProxyWithABISupport.balanceOf(signer.address))
  // console.log(await erc721ContractProxyWithABISupport.ownerOf(1))
  const tnx4 = await authoritativeContractProxyWithABISupport
      .connect(signer)
      .mintNFT()
  await tnx4.wait()
  // await expect(
  //     erc721ContractProxyWithABISupport
  //         .connect(signer)
  //         .mintNewNFTThroughContract(signer.address),
  // ).to.be.reverted
  console.log(await erc721ContractProxyWithABISupport.ownerOf(1));
  const tnx5 = await erc721ContractProxyWithABISupport.connect(signer).approve(authoritativeContractProxyWithABISupport.address, 1)
  await tnx5.wait()
  // const tnx6 = await authoritativeContractProxyWithABISupport.depositNFT(1)
  // await tnx6.wait()

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployAuthoritativeTokenUsingTransparentProxyPattern().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
