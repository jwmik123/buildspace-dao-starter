import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xBEdAF217355Be9bAb30283DC60Cc88A58366ADc6");

(async () => {
    try {
        const amount = 1_000_000;
        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log("There now is", totalSupply.displayValue, "$PSTY is circulation");
    } catch (err) {
        console.error("failed to print money", err);
    }
})();