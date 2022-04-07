import { useAddress, useMetamask, useEditionDrop, useToken } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initalize editionDrop
  const editionDrop = useEditionDrop("0x2E25f3157043E011400eEe7269C01014e13D51DC");
  // Initalize Token
  const token = useToken("0xBaeEcc5BAD9Fe7AcC4E1CF5E081435f9156a8cAF");
  // State variable to check if user has the NFT;
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0,6) + "..." + str.substring(str.length - 4);
  };

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        console.log("Member addresses", memberAddresses);
      } catch (err) {
        console.error("failed to get member list", err);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts("Amounts", amounts);
      } catch (err) {
        console.error("failed to get member balances", err);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

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



// Membership Dashboard
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>PosterityDAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
