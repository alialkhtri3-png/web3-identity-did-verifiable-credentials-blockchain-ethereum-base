import { ethers } from "ethers";


const provider =
new ethers.JsonRpcProvider(
"https://mainnet.base.org"
);



export async function scanTransactions(wallet){

    wallet = wallet.toLowerCase();


    const latest =
        await provider.getBlockNumber();


    const start =
        latest - 50000;


    let transactions = new Set();

    let contracts = new Set();

    let firstSeen = null;

    let lastActive = null;



    const step = 2000;



    for(
        let from = start;
        from < latest;
        from += step
    ){

        const to =
            Math.min(
                from + step - 1,
                latest
            );


        try{


            for(
                let block = from;
                block <= to;
                block++
            ){


                const data =
                await provider.getBlock(
                    block,
                    true
                );


                if(!data?.transactions)
                    continue;



                for(
                    const tx of data.transactions
                ){


                    const fromAddr =
                    tx.from?.toLowerCase();


                    const toAddr =
                    tx.to?.toLowerCase();



                    if(
                        fromAddr === wallet ||
                        toAddr === wallet
                    ){


                        transactions.add(
                            tx.hash
                        );



                        if(tx.to){

                            contracts.add(
                                tx.to
                            );

                        }



                        if(!firstSeen)
                            firstSeen =
                            tx.hash;



                        lastActive =
                            tx.hash;

                    }

                }

            }


        }catch(err){

            console.log(
                "Block scan error",
                from,
                err.message
            );

        }

    }



    return {


        transactions:
            transactions.size,


        contractsUsed:
            contracts.size,


        contracts:
            [...contracts],


        firstSeen,

        lastActive,


        scannedBlocks:
            latest-start,


        note:
        "Native ETH + Contract transaction scanner V8.5.1"


    };

}


export const scanBaseTransactions =
scanTransactions;
