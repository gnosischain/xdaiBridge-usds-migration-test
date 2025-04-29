// This test assume the setup.js is run (upgrade process)
// Relaying DAI & USDS from Source chain

import { createWalletClient, http, publicActions } from "viem";
import { parseAbiItem } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

import BRIDGE_ADDRESSES from "../utils/constant.js";
import {
  virtual_mainnet,
  validateRpcUrls,
} from "../utils/viemClientAndNetwork.js";
import { getUserRequestForAffirmationEvent } from "../utils/validator.js";

// Check if environment variables for RPC URLs are properly set
validateRpcUrls();

const account = privateKeyToAccount(process.env.USER_PRIVATE_KEY);

const ethClient = createWalletClient({
  account,
  chain: virtual_mainnet,
  transport: http(),
}).extend(publicActions);

async function main() {
  try {
    console.log("Relaying USDS...");

    // approve

    const { request: approveUsdsRequest } = await ethClient.simulateContract({
      address: BRIDGE_ADDRESSES.USDS,
      abi: [parseAbiItem("function approve(address spender, uint256 amount)")],
      functionName: "approve",
      args: [BRIDGE_ADDRESSES.BRIDGE_ROUTER, 1e18],
    });

    const approveUsdsTxHash = await ethClient.writeContract(approveUsdsRequest);

    console.log(
      `Approve Usds tx hash : ${virtual_mainnet.blockExplorers.default.url}/tx/${approveUsdsTxHash}`
    );

    // BridgeRouter relayTokens

    const { request: relayTokensUsdsRequest } =
      await ethClient.simulateContract({
        address: BRIDGE_ADDRESSES.BRIDGE_ROUTER,
        abi: [
          parseAbiItem(
            "function relayTokens(address token, address recipient, uint256 amount)"
          ),
        ],
        functionName: "relayTokens",
        args: [BRIDGE_ADDRESSES.USDS, account.address, 1e18],
      });

    const relayTokensUsdsTxHash = await ethClient.writeContract(
      relayTokensUsdsRequest
    );

    console.log(
      `relayTokens tx hash : ${virtual_mainnet.blockExplorers.default.url}/tx/${relayTokensUsdsTxHash}`
    );

    const relayTokensUsdsTxReceipt = await ethClient.getTransactionReceipt({
      hash: relayTokensUsdsTxHash,
    });

    getUserRequestForAffirmationEvent(relayTokensUsdsTxReceipt);

    console.log(
      "Waiting for block confirmation and validator to sign, please check log from checkBalanceUpdate.js"
    );

    console.log("Relaying Dai...");
    const { request: approveDaiRequest } = await ethClient.simulateContract({
      address: BRIDGE_ADDRESSES.DAI,
      abi: [parseAbiItem("function approve(address spender, uint256 amount)")],
      functionName: "approve",
      args: [BRIDGE_ADDRESSES.BRIDGE_ROUTER, 1e18],
    });

    const approveDaiTxHash = await ethClient.writeContract(approveDaiRequest);

    console.log(
      `Approve Dai tx hash : ${virtual_mainnet.blockExplorers.default.url}/tx/${approveDaiTxHash}`
    );

    // BridgeRouter relayTokens
    const { request: relayTokensDaiRequest } = await ethClient.simulateContract(
      {
        address: BRIDGE_ADDRESSES.BRIDGE_ROUTER,
        abi: [
          parseAbiItem(
            "function relayTokens(address token, address recipient, uint256 amount)"
          ),
        ],
        functionName: "relayTokens",
        args: [BRIDGE_ADDRESSES.DAI, account.address, 1e18],
      }
    );

    const relayTokensDaiTxHash = await ethClient.writeContract(
      relayTokensDaiRequest
    );

    console.log(
      `relayTokens tx hash : ${virtual_mainnet.blockExplorers.default.url}/tx/${relayTokensDaiTxHash}`
    );

    const relayTokensDaiTxReceipt = await ethClient.getTransactionReceipt({
      hash: relayTokensDaiTxHash,
    });

    getUserRequestForAffirmationEvent(relayTokensDaiTxReceipt);

    console.log(
      "Waiting for block confirmation and validator to sign, please check log from checkBalanceUpdate.js"
    );
  } catch (err) {
    console.error("Error fetching logs:", err);
  }
}

main();
