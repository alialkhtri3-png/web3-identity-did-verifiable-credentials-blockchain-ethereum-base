export function buildGraph(walletData){

    return {

        nodes:[
            {
                id:walletData.wallet,
                type:"wallet"
            }
        ],

        edges:[],

        clusters:[]

    };

}
