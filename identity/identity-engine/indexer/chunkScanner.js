import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://mainnet.base.org"
);

const TRANSFER_TOPIC = ethers.id(
  "Transfer(address,address,uint256)"
);


export async function scanHistoricalLogs(wallet){

    const latest =
        await provider.getBlockNumber();

    const CHUNK = 5000;

    let from =
        Math.max(
            0,
            latest - 100000
        );


    const address =
        wallet.toLowerCase()
        .replace("0x","")
        .padStart(64,"0");


    const topicAddress =
        "0x"+address;


    let transfers = [];
    let contracts = new Set();


    while(from < latest){

        let to =
            Math.min(
                from + CHUNK,
                latest
            );


        try{

            const logs =
            await provider.getLogs({

                fromBlock: from,
                toBlock: to,

                topics:[
                    TRANSFER_TOPIC,
                    null,
                    [
                      topicAddress
                    ]
                ]

            });


            for(const log of logs){

                transfers.push(log);

                contracts.add(
                    log.address
                );

            }


        }catch(e){

            console.log(
              "chunk error",
              from,
              to,
              e.message
            );

        }


        from =
            to + 1;

    }


    return {

        scannedBlocks:
            100000,

        transfers:
            transfers.length,

        contractsUsed:
            contracts.size,

        contracts:
            [...contracts]

    };

}
