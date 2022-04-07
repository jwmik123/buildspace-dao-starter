import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop("0x2E25f3157043E011400eEe7269C01014e13D51DC");

const token = sdk.getToken("0xBEdAF217355Be9bAb30283DC60Cc88A58366ADc6");

(async () => {
    try {
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0) {
            console.log("No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!");
            process.exit(0);
        }

        const airdropTargets = walletAddresses.map(address => {
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("Going to airdrop", randomAmount, "tokens to", address);

            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        });

        console.log("Starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("Successfully airdropped tokens to all the holders of the NFT!");
    } catch (err) {
        console.error("failed to airdrop tokens", err);
    }
})();
