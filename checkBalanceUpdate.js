const { createPublicClient, http, getAddress } = require("viem");
const { gnosisChiado } = require("viem/chains");
const { privateKeyToAccount } = require("viem/accounts");
require("dotenv").config();

const account = privateKeyToAccount(process.env.DAI_USER_PRIVATE_KEY);

const RPC_URL = "https://rpc.chiadochain.net";

const client = createPublicClient({
  chain: gnosisChiado,
  transport: http(RPC_URL),
});

let previousBalance = null;

async function checkBalance() {
  console.log(`Checking balance for address ${account.address}`);
  try {
    const currentBalance = await client.getBalance({
      address: account.address,
    });

    if (previousBalance !== null && currentBalance > previousBalance) {
      console.log("Balance updated:", currentBalance.toString(), "wei");
    }

    previousBalance = currentBalance;
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

setInterval(checkBalance, 5000); // Check balance every 5 seconds
