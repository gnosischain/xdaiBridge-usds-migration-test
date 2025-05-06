
#!/usr/bin/env bash

# Load environment variables
source .env 
source .env.xdai

echo "Starting bridge validator"

# Run bridge validator
ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY=${ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY} docker compose -f docker-compose-xdai-bridge-validator.yml up -d --build

echo "Waiting for all containers to be running..."
while [[ $(docker ps --format '{{.State}}' | grep -c "running") -lt $(docker ps --format '{{.State}}' | wc -l) ]]; do
    echo "Some containers are still starting..."
    sleep 5
done

echo "All containers are running. Proceeding..."

echo "Setting up the environment for Ethereum and Gnosis Chain post upgrade..."

RUN npm run tenderly:setup

echo "Relaying tokens from Ethereum"

RUN npm run tenderly:relayTokens

echo "Relaying xDAI from Gnosis Chain and claim Usds on Ethereum"

RUN npm run tenderly:relayxDaiAndClaim usds

echo "Relaying xDAI from Gnosis Chain and claim Dai on Ethereum"

RUN npm run tenderly:relayxDaiAndClaim dai"


