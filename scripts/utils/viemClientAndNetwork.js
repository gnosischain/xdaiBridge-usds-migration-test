import { defineChain } from "viem";
import "dotenv/config";

export const virtual_mainnet = defineChain({
  id: 1,
  name: "Virtual Mainnet",
  nativeCurrency: { name: "VETH", symbol: "vETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.TENDERLY_ETHEREUM_PUBLIC_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: "Tenderly Explorer",
      url: process.env.TENDERLY_ETHEREUM_BLOCK_EXPLORER_URL,
    },
  },
});

export const virtual_gnosis = defineChain({
  id: 100,
  name: "Virtual Gnosis",
  nativeCurrency: { name: "VxDAI", symbol: "VxDAI", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.TENDERLY_GNOSIS_PUBLIC_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: "Tenderly Explorer",
      url: process.env.TENDERLY_GNOSIS_BLOCK_EXPLORER_URL,
    },
  },
});

function validateRpcUrls() {
  const requiredRpcUrls = [
    "TENDERLY_ETHEREUM_PUBLIC_RPC",
    "TENDERLY_ETHEREUM_ADMIN_RPC",
    "TENDERLY_GNOSIS_PUBLIC_RPC",
    "TENDERLY_GNOSIS_ADMIN_RPC",
    "TENDERLY_ETHEREUM_BLOCK_EXPLORER_URL",
    "TENDERLY_GNOSIS_BLOCK_EXPLORER_URL",
  ];

  for (const rpcVar of requiredRpcUrls) {
    if (!process.env[rpcVar]) {
      throw new Error(`Missing environment variable: ${rpcVar}`);
    }

    try {
      const url = new URL(process.env[rpcVar]);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error(`Invalid protocol in ${rpcVar}: ${url.protocol}`);
      }
    } catch (error) {
      throw new Error(
        `Invalid URL format for ${rpcVar}: ${process.env[rpcVar]}`
      );
    }
  }

  console.log("All RPC URLs validated successfully");
}

export { validateRpcUrls };
