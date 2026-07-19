import { ethers } from "ethers";
import { scanHistoricalLogs } from "../indexer/chunkScanner.js";


const provider =
new ethers.JsonRpcProvider(
    "https://mainnet.base.org"
);


export async function scanBaseTransactions(wallet){

    const history =
        await scanHistoricalLogs(wallet);


    const latestBlock =
        await provider.getBlockNumber();


    return {

        wallet,

        latestBlock,


        transactions:
            history.transfers,


        contractsUsed:
            history.contractsUsed,


        contracts:
            history.contracts,


        firstSeen:null,


        lastActive:null,


        scannedBlocks:
            history.scannedBlocks,


        note:
            "Historical chunk indexer V8.5"

    };

}


export const scanTransactions =
    scanBaseTransactions;
