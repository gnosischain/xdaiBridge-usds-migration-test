# USDS xDAI bridge migrtion test

This repository simulate the end to end test on Sepolia<->Chiado, with bridge validator running.

## Test workflow

1. Relay DAI to normal xDAI bridge (DAI as ERC20 token) on Sepolia.
2. Run validator that listens to the normal xDAI bridge and call `executeAffirmations` on Chiado.
3. Mock USDS upgrade by switching interacting contract with USDS upgraded xDAI bridge and run a new set of validator that listens to that new xDAI bridge address, and call `executeAffirmations` on Chiado.
4. Relay USDS to the new xDAI bridge (USDS as ERC20 token) on Sepolia.

## Dev

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
DAI_USER_PRIVATE_KEY= # DAI & USDS holder on Sepolia
ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY= # bridge validator private key

Check balance of xDAI receiver
Run the following command in a new terminal, it constantly check if the balance of xDAI receiver is updated on Chiado

```
node checkBalanceUpdate.js
```

Relay token and run validator

```
chmod +x validatorTest.sh
./validatorTest.sh
```

## Reference

Due to there is no official DAI/USDS deployment from MakerDAO, mock DAI & USDS is deployed.

1. DAI: https://sepolia.etherscan.io/address/0x084Ab2ef1cb3A75EB0fDd81636e9A95D15629c37
2. https://eth-sepolia.blockscout.com/address/0xC441E98bFf10dD35b21AA4Eb22F95E6CAC2B608f
3. Normal xDAI bridge on Sepolia: 0x314CBF3F4405a2eaDe19af78773881beA37d15f8
4. USDS upgraded xDAI bridge on Sepolia: 0x10bc9B268d891a0024F7d49953c7C05Ca7F9A3C2
5. Corresponding xDAI bridge on Chiado: 0x8a3A3F0B9899c161393497e1aC32d6ca99289876
