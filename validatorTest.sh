
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


echo "Relaying DAI token from foreign bridge"
forge script script/RelayTokenScript.s.sol:RelayTokenScript --rpc-url  $SEPOLIA_RPC_URL --private-key $DAI_USER_PRIVATE_KEY --legacy --broadcast 
echo "Relay DAI to xDAI bridge completed"

echo "Waiting for bridge relaying process"
# sleep for 300 seconds to process the bridge relay tx
sleep 300 

# Perform bridge upgrade
echo "Executing bridge ugprade"
forge script script/UpgradeBridgeScript.s.sol:UpgradeBridgeScript --rpc-url  $SEPOLIA_RPC_URL --private-key $BRIDGE_OWNER_PRIVATE_KEY --legacy --broadcast 


echo "Relaying USDS token from foreign bridge"
forge script script/RelayTokenScript.s.sol:RelayTokenScript --rpc-url  $SEPOLIA_RPC_URL --private-key $DAI_USER_PRIVATE_KEY --legacy --broadcast
echo "Relay USDS to xDAI bridge completed"
# sleep for 300 seconds to process the bridge relay tx
sleep 300 


# For testing only, downgrading bridge to xDAI bridge
echo "Executing bridge ugprade"
forge script script/DowngradeBridgeScript.s.sol:DowngradeBridgeScript --rpc-url  $SEPOLIA_RPC_URL --private-key $BRIDGE_OWNER_PRIVATE_KEY --legacy --broadcast 
