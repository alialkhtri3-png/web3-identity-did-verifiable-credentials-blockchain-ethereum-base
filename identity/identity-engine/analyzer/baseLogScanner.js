import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
"https://mainnet.base.org"
);

const TRANSFER_TOPIC =
ethers.id("Transfer(address,address,uint256)");

export async function scanBaseLogs(wallet){

    if(!ethers.isAddress(wallet))
        throw new Error("Invalid wallet");

    const latestBlock =
        await provider.getBlockNumber();

    const range = 2000;

    const fromBlock =
        Math.max(
            0,
            latestBlock-range
        );


    const padded =
    "0x" +
    wallet
    .toLowerCase()
    .replace("0x","")
    .padStart(64,"0");


    let logs=[];


    try{

        logs =
        await provider.getLogs({

            fromBlock,
            toBlock:latestBlock,

            topics:[
                TRANSFER_TOPIC,
                null,
                padded
            ]

        });


    }catch(e){

        console.log(
        "SAFE LOG SCAN:",
        e.message
        );

    }


    return {

        wallet,

        blocksScanned:
        latestBlock-fromBlock,

        transfers:
        logs.length,

        contracts:
        [
            ...new Set(
                logs.map(
                    l=>l.address
                )
            )
        ]

    };

}
