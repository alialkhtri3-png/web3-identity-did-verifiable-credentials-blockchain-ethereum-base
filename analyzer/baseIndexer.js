import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
 process.env.BASE_RPC || "https://mainnet.base.org"
);

const TRANSFER_TOPIC =
"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";


export async function indexWallet(wallet){

    const latest = await provider.getBlockNumber();

    let logs = [];

    const STEP = 5000;

    let start = Math.max(
        0,
        latest - 20000
    );


    while(start < latest){

        let end = Math.min(
            start + STEP,
            latest
        );


        try {

            const chunk =
            await provider.getLogs({

                fromBlock:start,
                toBlock:end,

                topics:[
                    TRANSFER_TOPIC,
                    null,
                    ethers.zeroPadValue(wallet,32)
                ]

            });


            logs.push(...chunk);


        } catch(e){

            console.log(
                "Indexer chunk error:",
                e.message
            );

        }


        start = end + 1;

    }


    return {

        network:"Base",

        latestBlock:latest,

        transfers:logs.length,

        contracts:[
            ...new Set(
                logs.map(
                    x=>x.address
                )
            )
        ]

    };

}


// backward compatibility
export async function getBaseWalletData(wallet){

    return await indexWallet(wallet);

}
