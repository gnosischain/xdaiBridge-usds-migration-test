export function getUserRequestForAffirmationEvent(txReceipt) {
  // Filter logs for UserRequestForSignature event
  // Event signature: UserRequestForAffirmation(address recipient, uint256 value, bytes32 nonce)

  const serRequestAffirmationEventTopic =
    "0xf6968e689b3d8c24f22c10c2a3256bb5ca483a474e11bac08423baa049e38ae8";

  const relevantLog = txReceipt.logs.find(
    (log) => log.topics[0] === serRequestAffirmationEventTopic
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

export function mockValidatorSignAndExecute(txReceipt) {
  const { recipient, value, nonce } =
    getUserRequestForAffirmationEvent(txReceipt);

  // call executeAffirmation
}
