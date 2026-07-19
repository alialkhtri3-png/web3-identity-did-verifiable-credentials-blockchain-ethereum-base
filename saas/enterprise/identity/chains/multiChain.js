import { ethers } from "ethers";

const CHAINS = {

    Base:
    "https://mainnet.base.org",

    Ethereum:
    "https://cloudflare-eth.com",

    Arbitrum:
    "https://arb1.arbitrum.io/rpc",

    Optimism:
    "https://mainnet.optimism.io"

};


export async function scanMultiChain(wallet){

    const result = {};


    for(const [name,rpc] of Object.entries(CHAINS)){

        try{

            const provider =
            new ethers.JsonRpcProvider(rpc);


            const tx =
            await provider.getTransactionCount(wallet);


            const balance =
            await provider.getBalance(wallet);


            result[name]={

                transactions:tx,

                balance:
                ethers.formatEther(balance)

            };


        }catch(e){

            result[name]={

                transactions:0,

                balance:"0"

            };

        }

    }


    return result;

}
