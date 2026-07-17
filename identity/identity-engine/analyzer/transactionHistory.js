import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://mainnet.base.org"
);


export async function scanTransactionHistory(wallet){

    const latest =
      await provider.getBlockNumber();


    const start =
      latest - 100000;


    let txCount = 0;
    let contracts = new Set();


    for(
      let blockNumber=start;
      blockNumber<=latest;
      blockNumber+=2000
    ){

        try{

            const block =
              await provider.getBlock(
                blockNumber,
                true
              );


            if(!block || !block.prefetchedTransactions)
              continue;


            for(const tx of block.prefetchedTransactions){

                if(
                  tx.from?.toLowerCase()
                  === wallet.toLowerCase()
                ){

                    txCount++;


                    if(tx.to){
                        contracts.add(
                          tx.to
                        );
                    }

                }

            }


        }catch(e){

            continue;

        }

    }


    return {

        transactions:txCount,

        contractsUsed:
          contracts.size,

        contracts:
          [...contracts],

        scannedBlocks:
          100000

    };

}
