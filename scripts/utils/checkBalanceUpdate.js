import { createPublicClient, http } from "viem";
import { gnosisChiado } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

const account = privateKeyToAccount(process.env.USER_PRIVATE_KEY);

import { virtual_gnosis } from "../utils/viemClientAndNetwork.js";

// Determine which chain to use based on TEST_MODE
const chain =
  process.env.TEST_MODE === "tenderly" ? virtual_gnosis : gnosisChiado;

const client = createPublicClient({
  chain,
  transport: http(),
});

let previousBalance = null;

async function checkBalance() {
  try {
    const currentBalance = await client.getBalance({
      address: account.address,
    });

    const currentBlockNumber = await client.getBlockNumber();
    console.log(
      "Block ",
      currentBlockNumber,
      " address",
      account.address,
      " balance ",
      currentBalance
    );

    if (previousBalance !== null && currentBalance > previousBalance) {
      console.log("Balance updated:", currentBalance.toString(), "wei");
    }

    previousBalance = currentBalance;
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

setInterval(checkBalance, 10000); // Check balance every 10 seconds
