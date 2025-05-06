import { parseAbiItem } from "viem";
import BRIDGE_ADDRESSES from "./constant.js";

export function getUserRequestForAffirmationEvent(txReceipt) {
  // Filter logs for UserRequestForSignature event
  // Event signature: UserRequestForAffirmation(address recipient, uint256 value, bytes32 nonce)

  const UserRequestAffirmationEventTopic =
    "0xf6968e689b3d8c24f22c10c2a3256bb5ca483a474e11bac08423baa049e38ae8";

  const relevantLog = txReceipt.logs.find(
    (log) => log.topics[0] === UserRequestAffirmationEventTopic
  );
  if (relevantLog) {
    console.log("Found UserRequestForSignature event");

    // Decode the log data
    // The data contains: recipient (address), value (uint256), nonce (bytes32)
    const decodedData = {
      recipient: `0x${relevantLog.data.slice(26, 66)}`,
      value: BigInt(`0x${relevantLog.data.slice(66, 130)}`),
      nonce: `0x${relevantLog.data.slice(130, 194)}`,
    };

    console.log("Decoded event data:");
    console.log("Recipient:", decodedData.recipient);
    console.log("Value:", decodedData.value.toString());
    console.log("Nonce:", decodedData.nonce);
  } else {
    console.log("UserRequestForSignature event not found in transaction logs");
  }
  // Return null if no relevant log was found
  if (!relevantLog) {
    console.log("Returning null as no UserRequestForSignature event was found");
    return null;
  }

  // Decode the log data
  const decodedData = {
    recipient: `0x${relevantLog.data.slice(26, 66)}`,
    value: BigInt(`0x${relevantLog.data.slice(66, 130)}`),
    nonce: `0x${relevantLog.data.slice(130, 194)}`,
  };
  return decodedData;
}

export function mockValidatorSignAndExecute(gnoClient, txReceipt) {
  const { recipient, value, nonce } =
    getUserRequestForAffirmationEvent(txReceipt);

  // call executeAffirmation
}

export async function getUserRequestForSignatureEventAndGetSignatures(
  gnoClient,
  txReceipt
) {
  // fetch the event

  const UserRequestForSignatureEvent =
    "0xbcb4ebd89690a7455d6ec096a6bfc4a8a891ac741ffe4e678ea2614853248658";

  const xDAIBridgeHelper = "0x2d51eaa266eafcb59bb36dd3c7e99c515e58113a";

  const relevantLog = txReceipt.logs.find(
    (log) => log.topics[0] === UserRequestForSignatureEvent
  );
  if (relevantLog) {
    console.log("Found UserRequestForSignature event");

    // Decode the log data
    // The data contains: recipient (address), value (uint256), nonce (bytes32)
    const decodedData = {
      recipient: `0x${relevantLog.data.slice(26, 66)}`,
      value: BigInt(`0x${relevantLog.data.slice(66, 130)}`),
      nonce: `0x${relevantLog.data.slice(130, 194)}`,
    };

    // call xdai bridge helper

    const msgHash = await gnoClient.readContract({
      address: xDAIBridgeHelper,
      abi: [
        parseAbiItem(
          "function getMessageHash(address _recipient, uint256 _value, bytes32 _origTxHash) returns (bytes32)"
        ),
      ],
      functionName: "getMessageHash",
      args: [decodedData.recipient, decodedData.value, decodedData.nonce],
    });
    console.log("Message Hash ", msgHash);

    const message = await gnoClient.readContract({
      address: xDAIBridgeHelper,
      abi: [
        parseAbiItem("function getMessage(bytes32 _msgHash) returns (bytes)"),
      ],
      functionName: "getMessage",
      args: [msgHash],
    });

    console.log("Message ", message);
    const signatures = await gnoClient.readContract({
      address: xDAIBridgeHelper,
      abi: [
        parseAbiItem(
          "function getSignatures(bytes32 _msgHash) returns (bytes)"
        ),
      ],
      functionName: "getSignatures",
      args: [msgHash],
    });

    console.log("signatures ", signatures);
    return { message, signatures };
  } else {
    console.log("No UserRequestForSignature event found");
  }

  // wait for the signature
  // call bridge router executeSignature
  // call bridge router executeSignatureUSDS
}

export async function claimTokenOnEthereum(
  ethClient,
  message,
  signatures,
  token
) {
  if (token == "dai") {
    const { request: claimDaiRequest } = await ethClient.simulateContract({
      address: BRIDGE_ADDRESSES.BRIDGE_ROUTER,
      abi: [
        parseAbiItem(
          "function executeSignatures(bytes message, bytes signatures)"
        ),
      ],
      functionName: "executeSignatures",
      args: [message, signatures],
    });

    const claimDaiTxHash = await ethClient.writeContract(claimDaiRequest);

    console.log("Claim Dai Tx Hash ", claimDaiTxHash);
  } else if (token == "usds") {
    const { request: claimUsdsRequest } = await ethClient.simulateContract({
      address: BRIDGE_ADDRESSES.BRIDGE_ROUTER,
      abi: [
        parseAbiItem(
          "function executeSignaturesUSDS(bytes message, bytes signatures)"
        ),
      ],
      functionName: "executeSignaturesUSDS",
      args: [message, signatures],
    });

    const claimUsdsTxHash = await ethClient.writeContract(claimUsdsRequest);

    console.log("Claim Usds Tx Hash ", claimUsdsTxHash);
  } else {
    console.error("Invalid token type");
  }
}
