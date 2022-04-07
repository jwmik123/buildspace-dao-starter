import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react';
import { useState, useEffect } from 'react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initalize editionDrop
  const editionDrop = useEditionDrop("0x2E25f3157043E011400eEe7269C01014e13D51DC");
  // State variable to check if user has the NFT;
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // If they don't have a connected wallet... EXIT!
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("This user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("This user doesn't have a membership NFT...");
        }
      } catch (err) {
        setHasClaimedNFT(false);
        console.error("failed to get balance", err);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`Successfully minted, Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`)
      setHasClaimedNFT(true);
    } catch (err) { 
      console.error("failed to mint NFT", err);
    } finally {
      setIsClaiming(false);
    }
  };

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to PosterityDAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // Add this little piece!
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
    </div>
  );
};

  // Render mint screen
 return (
    <div className="mint-nft">
      <h1>Mint your well deserved DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your NFT (Free)"}
      </button>
    </div>
  );
};

export default App;
