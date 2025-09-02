# How to test in post migration environment?

Switch your RPC to:

1. Ethereum: https://virtual.mainnet.eu.rpc.tenderly.co/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c

   1. Block Explorer: https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/transactions

2. Gnosis Chain: https://virtual.gnosis.eu.rpc.tenderly.co/96b828f4-7ee3-4b46-b225-c136c404556b

   1. Block Explorer: https://dashboard.tenderly.co/explorer/vnet/96b828f4-7ee3-4b46-b225-c136c404556b/transactions

> > Warning: This environment will be shutdown after the migration is complete

## Configuration for post migration mainnet environments

Script from [here](./scripts/tenderlyTesting/setup.js)

### Ethereum

1. [xDAIForeignBridgeProxy.upgradeTo(10, 0x0e3ff9d26f78e32eae78c6544d498973f44f8d32)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0xa2cd37f62984aa730f56fcc898719a341cc0231f2442431ba9cad9cd64ef52e4)

2. [xDAIForeignBridgeProxy.swapSDAIToUSDS()](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0x6b6305cc22ec9ebd77045ded41b3aa3b210a927285c21884b76e3c222d423286)

3. [xDAIForeignBridgeProxy.initializeInterest(USDS,1000000000000000000000000,1000000000000000000000,0x670daeaF0F1a5e336090504C68179670B5059088)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0xfbd8750b6d5b1b37d56b048a65509c1cb1a25fac7ce3aafc66de4a0d1f866a24)

4. [xDAIForeignBridgeProxy.invest(USDS)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0x5df1b2c735c500892ea2677823826612a36b52a26b847e17623e41d7b38eb1a9)

5. BridgeRouter's [ProxyAdmin.upgradeToAndCall(proxy: 0x9a873656c19efecbfb4f9fab5b7acdeab466a0b0, Impl:0x66a837030aed8d437b5414f8ddf48b1005ca886b, data: 0x)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0x8e114f9f3b4e0d594d4a96a0d388fc3f1f73319f9579fa04c3a72b85a075b23e)

6. [BridgeRouter.setRoute(DAI, xDAIBridgePeripheral)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0xee232cea887e06d2b8dc9aa2b7d0792823d73351dc0b3bfd65ed6bd9086d8cf5)

7. [BridgeRouter.setRoute(USDS, xDAIForeignBridge)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0x50bd0f02e6b0d05a3c428fddf3e31aa16b7532f6605875a05512894006d8e62a)

8. [xDAI BridgeValidator.addValidator(mockValidator)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0x41ef5355e31f8f5592dc759070d22eabd9c3b6524b7ec9f049825cb238e44fd5)

9. [xDAI BridgeValidator.setRequiredSignatures(1)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0x9cf469017ef2333be63cd46872b68e95fd426eb0936f2951c0af480756103aa3)

10. [AMB BridgeValidator.addValidator(mockValidator)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0xa57eea9fe5685d7b868fff426aaa72e490f69b8a6301f3ec566c53baaae4f41c)

11. [AMB BridgeValidator.setRequiredSignatures(1)](https://dashboard.tenderly.co/explorer/vnet/3bb662f0-bdcd-44c3-8bf5-db99f7c9fb4c/tx/0x411f18e7afc0ed3cc829ed9c78cbc96a2c9a3f85be54f4b20a583862b0a23eff)

### Gnosis Chain

1. [HomeBridgeErcToNative.upgradeTo(7, 0xcb895ac6cf24170fafa5a704ae69eca9c8d98edd)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/86bbdde4-aae4-481f-965b-f8cfdbe7be60/tx/0xc4282eb5a77e9fc90bd1ca657421c943425480c4f92714c59e027c73c0cb420c)

2. [HomeBridgeErcToNative.setUSDSDepositContract(0x2b7a0437db808b86a4aec38c865e6a92534eefdc)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/86bbdde4-aae4-481f-965b-f8cfdbe7be60/tx/0x7239da1a3080fe928454224f006f0c0293168b0a12c0307338a5ac9790d7d0d5)

3. [xDAI BridgeValidators.addValidator(mockValidator)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/86bbdde4-aae4-481f-965b-f8cfdbe7be60/tx/0x954c7a3548e059e4b290ca8645d905c6b412589a82ecb94e84ad2e35eed2bcaf)

4. [xDAI BridgeValidators.setRequiredSigantures(1)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/86bbdde4-aae4-481f-965b-f8cfdbe7be60/tx/0x5cacc54d4667555159cb2a6a62e3572f1b67ee35a687b8a9cc454f7380ac3c60)

5. [AMB BridgeValidators.addValidator(mockValidator)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/86bbdde4-aae4-481f-965b-f8cfdbe7be60/tx/0x1d6820088aa9fd73d773c4efa3a3933cccdbc5f10e78094568c0a307eb697190)

6. [AMB BridgeValidators.setRequiredSignatures(1)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/86bbdde4-aae4-481f-965b-f8cfdbe7be60/tx/0x5fc492e0bb45865e6a0c69036190855d212f6fe68b2b45167c48c149e579730c)
