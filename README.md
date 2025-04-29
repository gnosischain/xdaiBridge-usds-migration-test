# USDS xDAI bridge migrtion test

This repository simulate the end to end test on Virtual Ethereum<->Gnosis Chain or Sepolia<->Chiado, with bridge validator running.

Please check the [main repository](https://github.com/gnosischain/tokenbridge-contracts/blob/feat/xdai-usds-migration/USDSMigration.md) for more information.

## Test on Tenderly Virtual TestNet For Ethereum <-> Gnosis Chain (recommended)

### Dev

Workflow

1. Get RPC from the Tenderly Virtual Network of Ethereum and Gnosis Chain, and configure the env variables.

2. Run the setup script `npm run tenderly:setup`

3. Run the check balance script in parallel `node checkBalanceUpdate.js`

4. Run bridge validator

```
env ORACLE_VALIDATOR_ADDRESS=$ORACLE_VALIDATOR_ADDRESS
env ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY=$ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY docker compose -f docker-compose-xdai-bridge-validator.yml up -d --build
```

5. Relay tokens from source chain `npm run tenderly:relayTokens`.

6. Wait for 30 mins to check if xDAI is minted to receiver on the Gnosis Chain.

## Test on Sepolia <-> Chiado

> > This flow is not recommended as there is no official DAI/USDS tokens deployed on Sepolia to simulate the actual workflow. Hence, a mock ERC20 token is deployed for the test.

1. Relay DAI to normal xDAI bridge (DAI as ERC20 token) on Sepolia.
2. Run validator that listens to the normal xDAI bridge and call `executeAffirmations` on Chiado.
3. Upgrade bridge to USDS-based bridge
4. Relay USDS to the new xDAI bridge on Sepolia.

### Dev

Install

```
forge install
npm install
```

Configuration

```
cp .env.example .env
```

Setup
USER_PRIVATE_KEY= # DAI & USDS holder on Sepolia / Ethereum
ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY= # bridge validator private key
BRIDGE_OWNER_PRIVATE_KEY= # bridge owner private key

Check balance of xDAI receiver  
Run the following command in a new terminal, it constantly checks if the balance of xDAI receiver is updated on Chiado

```
node checkBalanceUpdate.js
```

Relay token and run validator

```
chmod +x validatorTest.sh
./validatorTest.sh
```

### Reference

Due to there is no official DAI/USDS deployment from MakerDAO, mock DAI & USDS is deployed.

1. Mock DAI: [0x084Ab2ef1cb3A75EB0fDd81636e9A95D15629c37](https://sepolia.etherscan.io/address/0x084Ab2ef1cb3A75EB0fDd81636e9A95D15629c37)
2. Mock USDS: [0xC441E98bFf10dD35b21AA4Eb22F95E6CAC2B608f](https://eth-sepolia.blockscout.com/address/0xC441E98bFf10dD35b21AA4Eb22F95E6CAC2B608f)
3. Normal xDAI bridge on Sepolia: [0x314CBF3F4405a2eaDe19af78773881beA37d15f8](https://sepolia.etherscan.io/address/0x314CBF3F4405a2eaDe19af78773881beA37d15f8)
4. Corresponding xDAI bridge on Chiado: [0x8a3A3F0B9899c161393497e1aC32d6ca99289876](https://eth-sepolia.blockscout.com/address/0x8a3A3F0B9899c161393497e1aC32d6ca99289876)
