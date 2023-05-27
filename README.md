# Upgradable Smart Contract Patterns

This project includes
1. UUPS Proxy Pattern
2. Transparent Proxy Pattern
3. Clone Factory Pattern, with and without arguments
4. Way to upgrade proxies hardhat and javascript
5. tests


Helpful commands and contract references

```shell
npx hardhat test
npx hardhat verify --network goreli 0x9AfE6d2B7C0cE89E3CC45CA8F8E036fd21EEA97A
npx hardhat verify --network goreli 0xA734Da4C28D5ED383C0f6e9Fd152B7DCeC576837
npx hardhat verify --network goreli 0x70772F2b03BCbD1881c6040f3D474D9dbd81e565

```

Used Environmental Variables

```
ALCHEMY_MUMBAI_TESTNET_RPC_URL
ALCHEMY_GORELI_TESTNET_RPC_URL
INFURA_GORELI_TESTNET_RPC_URL
POLYGON_MUMBAI_RPC
PRIVATE_KEY
ETHERSCAN_API_KEY
REPORT_GAS: FALSE
```





# Note

0x00 - 0x00 Push
0x01 - 0x02 Add runSize ( 0x41 + (data.length + 2) - 10 )
0x03 - 0x13 (3d81600a3d39f33d3d3d3d363d3d3761) (16 words)
0x13 - 0x14 extraLength add (data.length + 2)
0x15 - 0x1a (603736393661) (6 words)
0x1b - 0x1c extraLength add (data.length + 2)
0x1d -  0x1f (013d73) 3 words
0x20 - 0x33 add implementation address
0x34 - 0x40(5af43d3d93803e603557fd5bf3) - 13 words

Call data size when calling the contract and passing encoded data should be the same
--- first phase takes 0x41 space ---

Append data and sending it with delegate call

data starts with the memory point offset to the length of the bytes
Hence first removes it

0x41 - 0x64 - size of data
0x64 - all data written in 0x20 chunks 


Immutable address has the init code and runtime code,
when cloning in the new address a runtime code of delegating to the immutable contract is deployed 


// todo - Pass external address in calldata, 
// todo - upgrade contracts using clone (only the new onces will be updated)
// if there is a constructor there can be vulnerabilities
how delegate coall is executed

With data what u would do is just persisting data in the newly created contract
which has the delegation logic pointing to the immutable contract
