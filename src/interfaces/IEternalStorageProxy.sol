pragma solidity ^0.8.10;

interface IEternalStorageProxy {
    function version() view external returns(uint256);
    function upgradeTo(uint256 version, address implementation) external;
}