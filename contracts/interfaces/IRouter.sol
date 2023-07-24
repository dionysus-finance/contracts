pragma solidity 0.8.13;

interface IRouter {
    function factory() external view returns (address);
    function pairFor(address tokenA, address tokenB, bool stable) external view returns (address pair);
}
