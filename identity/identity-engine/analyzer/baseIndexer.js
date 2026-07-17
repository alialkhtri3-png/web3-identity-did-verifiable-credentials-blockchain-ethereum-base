import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://mainnet.base.org"
);

const TRANSFER_TOPIC =
  ethers.id("Transfer(address,address,uint256)");

export async function getBaseWalletData(wallet){

    if(!ethers.isAddress(wallet)){
        throw new Error("Invalid wallet address");
    }

    const balance =
        await provider.getBalance(wallet);

    const latestBlock =
        await provider.getBlockNumber();


    const padded =
        ethers.zeroPadValue(wallet,32);


    let logs=[];

    try{

        logs = await provider.getLogs({

            fromBlock:
              Math.max(0, latestBlock - 50000),

            toBlock:
              latestBlock,

            topics:[
                TRANSFER_TOPIC,
                null,
                padded
            ]

        });


        const logsOut =
        await provider.getLogs({

            fromBlock:
              Math.max(0, latestBlock - 50000),

            toBlock:
              latestBlock,

            topics:[
                TRANSFER_TOPIC,
                padded
            ]

        });


        logs = [...logs,...logsOut];


    }catch(e){

        console.log(
          "Indexer scan error:",
          e.message
        );

    }


    let firstSeen=null;
    let lastActive=null;


    if(logs.length){

        const blocks =
        logs.map(x=>x.blockNumber)
            .sort((a,b)=>a-b);


        firstSeen=blocks[0];
        lastActive=blocks[blocks.length-1];

    }


    return {

        network:"Base",

        wallet,

        balance:{
            eth:ethers.formatEther(balance)
        },


        activity:{

            transactions:logs.length,

            firstSeen,

            lastActive,

            scannedBlocks:50000

        },


        tokens:[],


        graph:{

            nodes:[
              {
                id:wallet,
                type:"wallet"
              }
            ],

            edges:[]

        },


        chain:{

            chainId:8453,

            latestBlock

        }

    };

}
