import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = new ThirdwebSDK(
    new ethers.Wallet(
      // PRIVATE KEY > Never show this to anybody
      process.env.PRIVATE_KEY,
      // RPC URL > Alchemy API Key
      ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
    ),
);

(async () => {
    try {
      const address = await sdk.getSigner().getAddress();
      console.log("SDK initialized by address:", address)
    } catch (err) {
      console.error("Failed to get apps from the sdk", err);
      process.exit(1);
    }
})();

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;