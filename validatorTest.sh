
#!/usr/bin/env bash

# Load environment variables
source .env 
echo "Starting bridge validator"
# run docker-compose up -d --build
ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY=${ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY} docker compose -f docker-compose-xdai-bridge-validator.yml up -d --build

echo "Waiting for all containers to be running..."
while [[ $(docker ps --format '{{.State}}' | grep -c "running") -lt $(docker ps --format '{{.State}}' | wc -l) ]]; do
    echo "Some containers are still starting..."
    sleep 5
done

echo "All containers are running. Proceeding..."


echo "Relaying DAI token from foreign bridge"
# create a relayTokens function (script 1, get current chiado block number)
forge script script/RelayTokenScript.s.sol:RelayTokenScript --rpc-url  $SEPOLIA_RPC_URL --private-key $DAI_USER_PRIVATE_KEY --legacy --broadcast 
echo "Relay DAI to xDAI bridge completed"

# check the increment xdai of the address (call isValid)
# node checkBalanceUpdate.js


echo "Mocking bridge upgrade"
# # upgrade the bridge
# #!/usr/bin/env bash
# source .env
# JSON_OUTPUT=$(forge create --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --json --optimize XDaiForeignBridge)

# DEPLOYED_TO=$(jq -r '.deployedTo' <<< "$JSON_OUTPUT")

# # Update the NEW_IMPLEMENTATION variable in the .env file with the value of DEPLOYED_TO 
# # Requires .env and variable to already be declared!
# sed -i "s/^NEW_IMPLEMENTATION=.*/NEW_IMPLEMENTATION=$DEPLOYED_TO/" .env
# run docker-compose up -d --build
ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY=${ORACLE_VALIDATOR_ADDRESS_PRIVATE_KEY} docker compose -f docker-compose-usds-bridge-validator.yml up -d --build

echo "Waiting for all containers to be running..."
while [[ $(docker ps --format '{{.State}}' | grep -c "running") -lt $(docker ps --format '{{.State}}' | wc -l) ]]; do
    echo "Some containers are still starting..."
    sleep 5
done

echo "All containers are running. Proceeding..."


echo "Relaying USDS token from foreign bridge"
# # relayTokens (scirpt 1)
forge script script/RelayUSDSScript.s.sol:RelayUSDSScript --rpc-url  $SEPOLIA_RPC_URL --private-key $DAI_USER_PRIVATE_KEY --legacy --broadcast
echo "Relay DAI to xDAI bridge completed"
# # check the increment of xdai of the address
# node checkBalance.js