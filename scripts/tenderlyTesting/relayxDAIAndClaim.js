// This test assume the setup.js is run (upgrade process)
// Relaying DAI & USDS from Source chain

import { createWalletClient, http, publicActions } from "viem";
import { parseAbiItem, parseEther } from "viem";
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

// read from the npm command to claim USDS or DAI
// Parse command line arguments to determine which token to claim

// npm run relayxDAIAndClaim dai/usds

async function main() {
  try {
    const args = process.argv.slice(2);
    let tokenToClaim = "";

    if (args.length > 0) {
      const arg = args[0].toLowerCase();
      if (arg === "dai" || arg === "usds") {
        tokenToClaim = arg;
        console.log(`Will claim ${tokenToClaim.toUpperCase()} tokens`);
      } else {
        console.error('Invalid token specified. Please use "dai" or "usds"');
        process.exit(1);
      }
    } else {
      console.log("No token specified, defaulting to claiming USDS");
      tokenToClaim = "usds";
    }

    console.log("Relaying xDAI...");

    // BridgeRouter relayTokens

    const { request: relayTokensxDaiRequest } =
      await gnoClient.simulateContract({
        address: BRIDGE_ADDRESSES.XDAI_HOME_BRIDGE,
        abi: [parseAbiItem("function relayTokens(address recipient)")],
        functionName: "relayTokens",
        args: [account.address],
        value: parseEther("10"),
        gas: 2000000n,
      });

    // Get the current block number
    const currentBlockNumber = await gnoClient.getBlockNumber();

    const relayTokensxDaiTxHash = await gnoClient.writeContract(
      relayTokensxDaiRequest
    );

    console.log(
      `relayTokens xDai tx hash : ${virtual_gnosis.blockExplorers.default.url}/tx/${relayTokensxDaiTxHash}`
    );

    console.log("Waiting for the next block to be mined...");

    // Function to wait for the next block
    const waitForNextBlock = async () => {
      let latestBlockNumber;
      do {
        // Wait for 5 second before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000));
        latestBlockNumber = await gnoClient.getBlockNumber();
        console.log(`Latest block number: ${latestBlockNumber}`);
      } while (latestBlockNumber <= currentBlockNumber + 1n);

      console.log(`Next block confirmed: ${latestBlockNumber}`);
      return latestBlockNumber;
    };

    // Wait for the next block to be mined
    await waitForNextBlock();

    const relayTokensxDaiTxReceipt = await gnoClient.getTransactionReceipt({
      hash: relayTokensxDaiTxHash,
    });

    const { message, signatures } =
      await getUserRequestForSignatureEventAndGetSignatures(
        gnoClient,
        relayTokensxDaiTxReceipt
      );

    await claimTokenOnEthereum(ethClient, message, signatures, tokenToClaim);
  } catch (err) {
    console.error("Error fetching logs:", err);
  }
}

main();
