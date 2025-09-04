// This test assume the setup.js is run (upgrade process)
// Relaying DAI & USDS from Source chain

import {
  parseAbiItem,
  parseEther,
  parseEventLogs,
  keccak256,
  createWalletClient,
  http,
  publicActions,
  encodePacked,
  erc20Abi,
  parseAbi,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

import BRIDGE_ADDRESSES from "../utils/constant.js";
import {
  virtual_mainnet,
  virtual_gnosis,
  validateRpcUrls,
} from "../utils/viemClientAndNetwork.js";
import {
  getUserRequestForSignatureEventAndGetSignatures,
  claimTokenOnEthereum,
} from "../utils/validator.js";

// Check if environment variables for RPC URLs are properly set
validateRpcUrls();

const account = privateKeyToAccount(process.env.USER_PRIVATE_KEY);

const ethClient = createWalletClient({
  account,
  chain: virtual_mainnet,
  transport: http(),
}).extend(publicActions);

const gnoClient = createWalletClient({
  account,
  chain: virtual_gnosis,
  transport: http(),
}).extend(publicActions);

async function main() {
  const GNO = "0x6810e776880C02933D47DB1b9fc05908e5386b96";
  const Omnibridge = "0x88ad09518695c6c3712AC10a214bE5109a655671";
  // approve + relayTokens through Omnibridge
  const { request: approveRequest } = await ethClient.simulateContract({
    address: GNO, // GNO
    abi: [parseAbiItem("function approve(address _spender, uint256 _value)")],
    functionName: "approve",
    args: [Omnibridge, parseEther("1")],
  });

  const approveTx = await ethClient.writeContract(approveRequest);

  console.log("apprve tx", approveTx);

  const { request: relayTokensRequest } = await ethClient.simulateContract({
    address: Omnibridge,
    abi: [
      parseAbiItem(
        "function relayTokens(address token, uint256 value) external"
      ),
    ],
    functionName: "relayTokens",
    args: [GNO, parseEther("1")],
  });

  const relayTx = await ethClient.writeContract(relayTokensRequest);

  console.log("relay Tx", relayTx);
}

main();
