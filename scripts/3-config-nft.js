import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x2E25f3157043E011400eEe7269C01014e13D51DC");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "First PW Render",
                description: "This NFT grants access to PosterityDAO",
                image: readFileSync("scripts/assets/posterity.png"),
            },
        ]);
        console.log("Successfully created a new NFT in the drop!");
    } catch (err) {
        console.error("failed to create the new NFT", err);
    }
})();