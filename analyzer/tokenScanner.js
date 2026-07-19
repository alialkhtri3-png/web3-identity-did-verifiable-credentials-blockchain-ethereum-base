import { ethers } from "ethers";
import { scanLogs } from "./baseLogScanner.js";


const TRANSFER_TOPIC =
ethers.id(
"Transfer(address,address,uint256)"
);


export async function scanTokens(
    provider,
    wallet,
    fromBlock,
    toBlock
){

    const address =
    ethers.getAddress(wallet);


    const filter = {

        topics:[
            TRANSFER_TOPIC,
            null,
            ethers.zeroPadValue(address,32)
        ]

    };


    const logs =
    await scanLogs(
        provider,
        filter,
        fromBlock,
        toBlock
    );


    return {

        transfers:logs.length,

        tokens:[
            ...new Set(
                logs.map(
                    x=>x.address
                )
            )
        ]

    };

}
