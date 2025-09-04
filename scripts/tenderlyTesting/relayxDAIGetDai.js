// This test assume the setup.js is run (upgrade process)
// Relaying DAI & USDS from Source chain
// npm run reltenderly:relayxDaiGetDai
import {
  parseAbiItem,
  parseEther,
  parseEventLogs,
  keccak256,
  createWalletClient,
  http,
  publicActions,
  encodePacked,
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
  try {
    console.log("Relaying xDAI and get DAI on Ethereum...");

    // xDAI Home Bridge relayTokens
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

    // find the log
    const receipt = await gnoClient.getTransactionReceipt({
      hash: relayTokensxDaiTxHash,
    });

    const logs = parseEventLogs({
      abi: [
        parseAbiItem(
          "event UserRequestForSignature(address recipient, uint256 value, bytes32 nonce, address token)"
        ),
      ],
      eventName: "UserRequestForSignature",
      logs: receipt.logs,
    });

    let nonce, storageSlot;
    if (logs.length != 0) {
      console.log(`Found ${logs.length} UserRequestForSignature event`);
      nonce = `0x${logs[0].data.slice(130, 194)}`;

      // Get the storage slot of relayedMessages given the nonce to override if required
      // https://github.com/gnosischain/tokenbridge-contracts/blob/master/contracts/upgradeable_contracts/MessageRelay.sol#L7
      storageSlot = keccak256(
        encodePacked(
          ["bytes32", "uint256"],
          [
            keccak256(
              encodePacked(["string", "bytes32"], ["relayedMessages", nonce])
            ),
            4, // boolStorage mapping is at slot 4, https://github.com/gnosischain/tokenbridge-contracts/blob/master/contracts/upgradeability/EternalStorage.sol#L12
          ]
        )
      );
    }
    console.log("Waiting for the next block to be mined...");

    console.log("storage slot ", storageSlot);

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

    // in Virtual Testnet, it is possible that the tx with same nonce nonce has already been relayed on Ethereum
    // relayedMessages(_nonce) will revert is such case, for testing purpose, we override the storage slot to false to make the testing pass

    const isRelayed = await ethClient.readContract({
      address: BRIDGE_ADDRESSES.XDAI_FOREIGN_BRIDGE,
      abi: [
        parseAbiItem(
          "function relayedMessages(bytes32 _nonce) public view returns (bool)"
        ),
      ],
      functionName: "relayedMessages",
      args: [nonce],
    });

    if (isRelayed) {
      //https://docs.tenderly.co/node/rpc-reference/ethereum-mainnet/eth_getStorageAt
      const overrideRelayedMessagePaylod = {
        id: 1,
        jsonrpc: "2.0",
        method: "tenderly_setStorageAt",
        params: [
          BRIDGE_ADDRESSES.XDAI_FOREIGN_BRIDGE,
          storageSlot,
          "0x0000000000000000000000000000000000000000000000000000000000000000", // set to false
        ],
      };
      const response = await axios.post(
        process.env.TENDERLY_ETHEREUM_ADMIN_RPC,
        overrideRelayedMessagePaylod
      );
    }
    await claimTokenOnEthereum(ethClient, message, signatures);
  } catch (err) {
    console.error("Error fetching logs:", err);
  }
}

main();
