import {
  parseAbiItem,
  parseEther,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

import {
  virtual_mainnet,
  virtual_gnosis,
  validateRpcUrls,
} from "../utils/viemClientAndNetwork.js";

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
  const GNO = "0x9c58bacc331c9aa871afd802db6379a98e80cedb";
  const Omnibridge = "0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d";
  // approve + relayTokens through Omnibridge
  const { request: approveRequest } = await gnoClient.simulateContract({
    address: GNO, // GNO
    abi: [parseAbiItem("function approve(address _spender, uint256 _value)")],
    functionName: "approve",
    args: [Omnibridge, parseEther("1")],
  });

  const approveTx = await gnoClient.writeContract(approveRequest);

  console.log("apprve tx", approveTx);

  const { request: relayTokensRequest } = await gnoClient.simulateContract({
    address: Omnibridge,
    abi: [
      parseAbiItem(
        "function relayTokens(address token, uint256 value) external"
      ),
    ],
    functionName: "relayTokens",
    args: [GNO, parseEther("1")],
  });

  const relayTx = await gnoClient.writeContract(relayTokensRequest);

  console.log("relay Tx", relayTx);
}

main();
