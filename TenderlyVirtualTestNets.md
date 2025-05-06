# How to test in post migration environment?

Switch your RPC to:

1. Ethereum: https://virtual.mainnet.rpc.tenderly.co/f7d3ce08-c1ea-42da-87f1-4a40f335dda9

   1. Block Explorer: https://dashboard.tenderly.co/explorer/vnet/f7d3ce08-c1ea-42da-87f1-4a40f335dda9/transactions

2. Gnosis Chain: https://virtual.gnosis.rpc.tenderly.co/c9ef8faf-bac8-40d0-8530-ded119b8012a

   1. Block Explorer: https://dashboard.tenderly.co/explorer/vnet/c9ef8faf-bac8-40d0-8530-ded119b8012a/transactions

> > Warning: This environment will be shutdown after the migration is complete

## Configuration for post migration mainnet environments

Script from [here](./scripts/tenderlyTesting/setup.js)

### Ethereum

1. [xDAIForeignBridgeProxy.upgradeTo(10, 0x3abd91b5564baf7966dca7a30bd50eacc9abed77)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0x5941d869e9fd27dc0f9e431ae05716c937730070605b100b49f2653127b13c15)

2. [xDAIForeignBridgeProxy.swapSDAIToUSDS()](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0x6b6305cc22ec9ebd77045ded41b3aa3b210a927285c21884b76e3c222d423286)

3. [xDAIForeignBridgeProxy.initializeInterest(USDS,1000000000000000000000000,1000000000000000000000,0x670daeaF0F1a5e336090504C68179670B5059088)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0xfbd8750b6d5b1b37d56b048a65509c1cb1a25fac7ce3aafc66de4a0d1f866a24)

4. [xDAIForeignBridgeProxy.invest(USDS)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0x5df1b2c735c500892ea2677823826612a36b52a26b847e17623e41d7b38eb1a9)

5. [BridgeRouter.setRoute(DAI, xDAIBridgePeripheral)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0x3b9257b7bba15f3fcc3e9817274e09225b7ed487b518786384cf3ac1ff5a07fc)

6. [BridgeRouter.setRoute(USDS, xDAIForeignBridge)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0xb5d11d200d2da4cbf48ba35015629b96b27fa120e54820e8869f15f719da38b1)

7. [xDAI BridgeValidator.addValidator(mockValidator)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0x9897c631b22252c936180be5e713eebfc3980d251b82c53747d3cb4cb6ea223d)

8. [xDAI BridgeValidator.setRequiredSignatures(1)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0x2e5dccbce4d788656de9cf99416bb8fc9cf2ebe189bbdcc34efdf6dc616ea4e2)

9. [AMB BridgeValidator.addValidator(mockValidator)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0x96aa3d1f4ec7f293f79ec1d16cae56ef2bd944c573ee2d746ea93609cbff2a06)

10. [AMB BridgeValidator.setRequiredSignatures(1)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/30a99781-48aa-49e2-8688-69d06dd18ef1/tx/0xed90c5f8e7a590bc08780a3b41f5be044529001d035937eb5df06ef9d767e9de)

### Gnosis Chain

1. [xDAI BridgeValidators.addValidator(mockValidator)](https://dashboard.tenderly.co/explorer/vnet/c9ef8faf-bac8-40d0-8530-ded119b8012a/tx/0xf09c374c2108305e8f3381653dc1de090d1ce2af09b7dac5dcd9af20779e36f3)

2. [xDAI BridgeValidators.setRequiredSigantures(1)](https://dashboard.tenderly.co/explorer/vnet/c9ef8faf-bac8-40d0-8530-ded119b8012a/tx/0xd29f2384c10f62d72ac3085e1a58ab32b40a97c86be0c8daec93056d30a10a25)

3. [AMB BridgeValidators.addValidator(mockValidator)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/73156102-bf8b-47bb-8839-6ae03d87564c/tx/0xe3be21b55587d20a293f975acb6f90cd215d8cbf924a5ea0266fbece1a3244ae)

4. [AMB BridgeValidators.setRequiredSignatures(1)](https://dashboard.tenderly.co/gnosisdao/bridges/testnet/73156102-bf8b-47bb-8839-6ae03d87564c/tx/0xbab0168afa064fe5bf329534221ca811b0efd209af49f2e95cbeba5a4f11086b)
