// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import { IERC20 } from "../src/interfaces/IERC20.sol";
import { IXDaiForeignBridge } from "../src/interfaces/IXDaiForeignBridge.sol";

contract RelayTokenScript is Script {
    function run() public{

        uint256 amount = 1e18; // 1 DAI or 1 USDS
        uint256 daiUserPk= vm.envUint("DAI_USER_PRIVATE_KEY");

        IXDaiForeignBridge xdaiForeignBridge = IXDaiForeignBridge(vm.envAddress("XDAI_FOREIGN_BRIDGE_PROXY"));
        vm.startBroadcast(daiUserPk);

        address erc20Token = xdaiForeignBridge.erc20token();
        // call DAI.approve(xdaibridge)
        IERC20(erc20Token).approve(address(xdaiForeignBridge), amount);

        // call xDAI bridge relay
        xdaiForeignBridge.relayTokens(vm.addr(daiUserPk), amount);
    
    }
}