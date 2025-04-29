// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import { IEternalStorageProxy } from "../src/interfaces/IEternalStorageProxy.sol";

contract DowngradeBridgeScript is Script {
    function run() public{

        uint256 bridgeOwnerPk= vm.envUint("BRIDGE_OWNER_PRIVATE_KEY");
        address xdaiBridge = vm.envAddress("XDAI_FOREIGN_BRIDGE_IMPLEMENTATION");

        IEternalStorageProxy xdaiForeignBridge = IEternalStorageProxy(vm.envAddress("XDAI_FOREIGN_BRIDGE_PROXY"));
        vm.startBroadcast(bridgeOwnerPk);
        uint256 newVersion = xdaiForeignBridge.version() + 1;

        xdaiForeignBridge.upgradeTo(newVersion, xdaiBridge);
        vm.stopBroadcast();
    
    }
}