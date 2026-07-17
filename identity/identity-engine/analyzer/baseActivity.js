import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://mainnet.base.org"
);

export async function analyzeActivity(wallet){

    const block =
        await provider.getBlockNumber();

    return {

        transactions:0,

        firstSeen:null,

        lastActive:null,

        currentBlock:block,

        contractsUsed:0,

        activeDays:0,

        note:"Add Base indexer API for full history"

    };

}
