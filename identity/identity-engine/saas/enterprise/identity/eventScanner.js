import { ethers } from "ethers";

const RPC =
process.env.BASE_RPC ||
"https://mainnet.base.org";

const provider =
new ethers.JsonRpcProvider(RPC);

const transferTopic =
ethers.id("Transfer(address,address,uint256)");


async function getLogsSafe(wallet, fromBlock, toBlock, topic){

    const chunk = 9000;

    let results=[];


    for(
        let start=fromBlock;
        start<=toBlock;
        start+=chunk
    ){

        const end =
        Math.min(
            start + chunk - 1,
            toBlock
        );


        const logs =
        await provider.getLogs({

            fromBlock:start,
            toBlock:end,

            topics:[
                transferTopic,
                ...topic
            ]

        });


        results.push(...logs);

    }


    return results;

}


export async function scanEvents(wallet){

    const address =
    ethers.getAddress(wallet);


    const latest =
    await provider.getBlockNumber();


    const from =
    latest - 50000;


    const incoming =
    await getLogsSafe(
        address,
        from,
        latest,
        [
            null,
            ethers.zeroPadValue(address,32)
        ]
    );


    const outgoing =
    await getLogsSafe(
        address,
        from,
        latest,
        [
            ethers.zeroPadValue(address,32),
            null
        ]
    );


    const tokenSet =
    new Set(
        incoming
        .concat(outgoing)
        .map(
            x=>x.address
        )
    );


    return {

        transfers:
        incoming.length + outgoing.length,

        tokens:
        tokenSet.size,

        connections:
        tokenSet.size

    };

}
