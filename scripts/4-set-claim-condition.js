import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x2E25f3157043E011400eEe7269C01014e13D51DC");

(async () => {
    try {
        const claimConditions = [{
            startTime: new Date(),
            maxQuantity: 50_000,
            price: 0, // You will need to be a holder of a Posterity Watch
            quantityLimitPerTransaction: 1,
            waitInSeconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Successfully set claim conditions!");
    } catch (err) {
        console.error("failed to set claim conditions", err);
    }
})();