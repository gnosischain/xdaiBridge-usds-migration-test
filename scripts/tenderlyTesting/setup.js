// setup the test environment on both chains
import "dotenv/config";

import axios from "axios";

// 1. HomeBridgeErcToNative: 0xCb895Ac6cF24170FaFa5a704aE69ECA9C8D98EDd
// 2. USDSDepositContract: 0x2b7a0437db808b86a4aec38c865e6a92534eefdc
// 3. BridgeRouter new impl: 0x66a837030aed8d437b5414f8ddf48b1005ca886b
// 4. xDAIForeignBridge: 0x0e3FF9d26F78E32eAE78C6544D498973F44f8D32
(async () => {
  // HomeBridgeErcToNative.upgradeToAndCall(7, 0xcb895ac6cf24170fafa5a704ae69eca9c8d98edd)
  const GCupgradeProxyPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd",
        to: "0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6",
        value: "0x0",
        data: "0x3ad06d160000000000000000000000000000000000000000000000000000000000000007000000000000000000000000cb895ac6cf24170fafa5a704ae69eca9c8d98edd",
      },
    ],
  };
  const GCupgradeProxyResponse = await axios.post(
    process.env.TENDERLY_GNOSIS_ADMIN_RPC,
    GCupgradeProxyPayload
  );
  console.log("GCupgradeProxyResponse", GCupgradeProxyResponse);

  // set USDS deposit contract
  const GCsetDepositContractPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd",
        to: "0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6",
        value: "0x0",
        data: "0x5d5696c00000000000000000000000002b7a0437db808b86a4aec38c865e6a92534eefdc",
      },
    ],
  };
  const GCsetDepositContractResponse = await axios.post(
    process.env.TENDERLY_GNOSIS_ADMIN_RPC,
    GCsetDepositContractPayload
  );
  console.log("GCsetDepositContractResponse", GCsetDepositContractResponse);

  // xDAIForeignBridgeProxy.upgradeTo(10, 0x0e3FF9d26F78E32eAE78C6544D498973F44f8D32)

  const upgradeProxyPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016",
        value: "0x0",
        data: "0x3ad06d16000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e3FF9d26F78E32eAE78C6544D498973F44f8D32",
      },
    ],
  };
  const upgradeProxyResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    upgradeProxyPayload
  );
  console.log("xDAIForeignBridgeProxy upgraded ", upgradeProxyResponse);

  // xDAIForeignBridgeProxy.swapSDAIToUSDS()
  const swapSDaiToUsdsPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016",
        value: "0x0",
        data: "0xfda8babc",
      },
    ],
  };
  const swapSDaiToUsdsResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    swapSDaiToUsdsPayload
  );
  console.log(
    " xDAIForeignBridgeProxy.swapSDAIToUSDS() ",
    swapSDaiToUsdsResponse
  );
  // xDAIForeignBridgeProxy.initializeInterest(0xdC035D45d973E3EC169d2276DDab16f1e407384F,1000000000000000000000000,1000000000000000000000,0x670daeaF0F1a5e336090504C68179670B5059088)
  const initializeInterestPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016",
        value: "0x0",
        data: "0xcd0fc033000000000000000000000000dc035d45d973e3ec169d2276ddab16f1e407384f00000000000000000000000000000000000000000000d3c21bcecceda100000000000000000000000000000000000000000000000000003635c9adc5dea00000000000000000000000000000670daeaf0f1a5e336090504c68179670b5059088",
      },
    ],
  };
  const initializeInterestsResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    initializeInterestPayload
  );
  console.log(
    "xDAIForeignBridgeProxy.initializeInterest called ",
    initializeInterestsResponse
  );
  // invest
  const investPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016",
        value: "0x0",
        data: "0x03f9c793000000000000000000000000dc035d45d973e3ec169d2276ddab16f1e407384f",
      },
    ],
  };
  const investResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    investPayload
  );
  console.log("xDAIForeignBridgeProxy.invest(USDS) called ", investResponse);
  // Upgrade BridgeRouter implementation
  const upgradeBridgeRouterPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0xD7e65A32bEd4ce8cc57Ec188F2bBb8016dc4b1cd", // ProxyAdmin
        value: "0x0",
        data: "0x9623609d0000000000000000000000009a873656c19efecbfb4f9fab5b7acdeab466a0b000000000000000000000000066a837030aed8d437b5414f8ddf48b1005ca886b00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
      },
    ],
  };
  const upgradeBridgeRouterResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    upgradeBridgeRouterPayload
  );
  console.log("BridgeRouter upgraded ", upgradeBridgeRouterResponse);
  // set Dai route BridgeRouter.setRoute(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x3b6669727927b934753B018EB421a84Ed4eb0a43)
  const setDaiRoutePayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0x9a873656c19Efecbfb4f9FAb5B7acdeAb466a0B0",
        value: "0x0",
        data: "0x0505e94d0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000003b6669727927b934753b018eb421a84ed4eb0a43",
      },
    ],
  };
  const setDaiRouteResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    setDaiRoutePayload
  );
  console.log(
    "BridgeRouteProxy.setRoute(DAI, xDAIBridgePeripheralForDaiPreUsdsUpgrade) called ",
    setDaiRouteResponse
  );
  // set Usds route BridgeRouter.setRoute(0xdC035D45d973E3EC169d2276DDab16f1e407384F, 0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016)
  const setUsdsRoutePayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0x9a873656c19Efecbfb4f9FAb5B7acdeAb466a0B0",
        value: "0x0",
        data: "0x0505e94d000000000000000000000000dc035d45d973e3ec169d2276ddab16f1e407384f0000000000000000000000004aa42145aa6ebf72e164c9bbc74fbd3788045016",
      },
    ],
  };
  const setUsdsRouteResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    setUsdsRoutePayload
  );
  console.log(
    "BridgeRouteProxy.setRoute(USDS, xDAIBridgePeripheralForUsdsPreUsdsUpgrade) called ",
    setUsdsRouteResponse
  );
  // add mock validator BridgeValidatorsProxy.addValidator(address)
  const setMockValidatorPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E",
        value: "0x0",
        data: "0x4d238c8e000000000000000000000000725bc6f18f8cdd7f57a9ab9a9f2ea17a199185e5",
      },
    ],
  };
  const setMockValidatorResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    setMockValidatorPayload
  );
  console.log(
    "BridgeValidators.addValidator called ",
    setMockValidatorResponse
  );
  //set required signature(1)
  const setRequiredSignaturesPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0xe1579dEbdD2DF16Ebdb9db8694391fa74EeA201E",
        value: "0x0",
        data: "0x7d2b9cc00000000000000000000000000000000000000000000000000000000000000001",
      },
    ],
  };
  const setRequiredSignaturesResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    setRequiredSignaturesPayload
  );
  console.log(
    "BridgeValidators.setRequiredSignatures(1) called ",
    setRequiredSignaturesResponse
  );
  const setMockValidatorAMBPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064",
        value: "0x0",
        data: "0x4d238c8e000000000000000000000000725bc6f18f8cdd7f57a9ab9a9f2ea17a199185e5",
      },
    ],
  };
  const setMockValidatorAMBResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    setMockValidatorAMBPayload
  );
  console.log(
    "BridgeValidators.addValidator called ",
    setMockValidatorAMBResponse
  );
  const setRequiredSignaturesAMBPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6",
        to: "0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064",
        value: "0x0",
        data: "0x7d2b9cc00000000000000000000000000000000000000000000000000000000000000001",
      },
    ],
  };
  const setRequiredSignaturesAMBResponse = await axios.post(
    process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
    setRequiredSignaturesAMBPayload
  );
  console.log(
    "BridgeValidators.setRequiredSignatures(1) called ",
    setRequiredSignaturesAMBResponse
  );
  // Add mock validator  in Gnosis Chain
  const setMockValidatorGnosisPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd",
        to: "0xB289f0e6fBDFf8EEE340498a56e1787B303F1B6D",
        value: "0x0",
        data: "0x4d238c8e000000000000000000000000725bc6f18f8cdd7f57a9ab9a9f2ea17a199185e5",
      },
    ],
  };
  const setMockValidatorGnosisResponse = await axios.post(
    process.env.TENDERLY_GNOSIS_ADMIN_RPC,
    setMockValidatorGnosisPayload
  );
  console.log(
    "Gnosis Chain: BridgeValidators.addValidator called ",
    setMockValidatorGnosisResponse
  );
  const setRequiredSignaturesGnosisPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd",
        to: "0xB289f0e6fBDFf8EEE340498a56e1787B303F1B6D",
        value: "0x0",
        data: "0x7d2b9cc00000000000000000000000000000000000000000000000000000000000000001",
      },
    ],
  };
  const setRequiredSignaturesGnosisResponse = await axios.post(
    process.env.TENDERLY_GNOSIS_ADMIN_RPC,
    setRequiredSignaturesGnosisPayload
  );
  console.log(
    "Gnosis Chain: BridgeValidators.setRequiredSignatures(1) called ",
    setRequiredSignaturesGnosisResponse
  );
  const setMockValidatorGnosisAMBPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd",
        to: "0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008",
        value: "0x0",
        data: "0x4d238c8e000000000000000000000000725bc6f18f8cdd7f57a9ab9a9f2ea17a199185e5",
      },
    ],
  };
  const setMockValidatorGnosisAMBResponse = await axios.post(
    process.env.TENDERLY_GNOSIS_ADMIN_RPC,
    setMockValidatorGnosisAMBPayload
  );
  console.log(
    "Gnosis Chain: BridgeValidators.addValidator called ",
    setMockValidatorGnosisAMBResponse
  );
  const setRequiredSignaturesGnosisAMBPayload = {
    id: 0,
    jsonrpc: "2.0",
    method: "eth_sendTransaction",
    params: [
      {
        from: "0x7a48Dac683DA91e4faa5aB13D91AB5fd170875bd",
        to: "0xA280feD8D7CaD9a76C8b50cA5c33c2534fFa5008",
        value: "0x0",
        data: "0x7d2b9cc00000000000000000000000000000000000000000000000000000000000000001",
      },
    ],
  };
  const setRequiredSignaturesGnosisAMBResponse = await axios.post(
    process.env.TENDERLY_GNOSIS_ADMIN_RPC,
    setRequiredSignaturesGnosisAMBPayload
  );
  console.log(
    "Gnosis Chain: BridgeValidators.setRequiredSignatures(1) called ",
    setRequiredSignaturesGnosisAMBResponse
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
