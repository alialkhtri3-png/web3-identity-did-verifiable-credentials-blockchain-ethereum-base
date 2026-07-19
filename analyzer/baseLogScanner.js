import { ethers } from "ethers";

const RPC =
process.env.BASE_RPC ||
"https://mainnet.base.org";

const provider = new ethers.JsonRpcProvider(RPC);

const TRANSFER_TOPIC =
"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";


async function safeLogs(wallet){

    const latest =
        await provider.getBlockNumber();

    const from =
        Math.max(
            latest - 50000,
            0
        );

    const step = 5000;

    let logs=[];


    for(
        let start=from;
        start<latest;
        start+=step
    ){

        let end =
        Math.min(
            start+step-1,
            latest
        );


        try{

            const batch =
            await provider.getLogs({

                fromBlock:start,

                toBlock:end,

                topics:[
                    TRANSFER_TOPIC,
                    null,
                    ethers.zeroPadValue(
                        wallet,
                        32
                    )
                ]

            });


            logs.push(...batch);


        }catch(err){

            console.log(
                "log batch skipped:",
                start,
                end
            );

        }

    }


    return logs;

}



export async function scanBaseLogs(wallet){

    const logs =
    await safeLogs(wallet);


    return {

        count:logs.length,

        transfers:logs.slice(0,50).map(x=>({

            token:x.address,

            block:x.blockNumber,

            tx:x.transactionHash

        }))


    };

}



export async function scanLogs(wallet){

    return scanBaseLogs(wallet);

}
