import { getBaseWalletData } from "./baseIndexer.js";
import { scanTransactions } from "./transactionScanner.js";
import { scanBaseLogs } from "./baseLogScanner.js";
import { scanTokens } from "./tokenScanner.js";
import { buildGraph } from "./graphBuilder.js";
import { detectSybil } from "./sybilDetector.js";
import { calculateReputation } from "../calculateReputation.js";

export async function analyzeWallet(wallet){

    const chainId = 8453;

    const baseData = await getBaseWalletData(wallet);

    const activity = {
        ...await scanTransactions(wallet),
        transactions:
            baseData.activity.transactions,
        firstSeen:
            baseData.activity.firstSeen,
        lastActive:
            baseData.activity.lastActive,
        baseIndexer:true
    };

    activity.base = baseData;

    const logs = await scanBaseLogs(wallet);

    const tokens = await scanTokens(wallet);

    const graph = buildGraph({
        wallet,
        activity
    });

    const sybil = detectSybil({
        wallet,
        graph
    });


    const reputation = calculateReputation({
        activity,
        tokens,
        sybil
    });


    return {

        wallet,

        network:"Base",

        chain:{
            chainId,
            latestBlock: activity?.latestBlock || null
        },


        activity,

        tokens,

        graph,

        reputation,

        sybil,


        engine:{
            version:"V8.5.1-TX-INTELLIGENCE",

            modules:[

                "BaseIndexer",
                "TransactionScanner",
                "BaseLogScanner",
                "WalletAge",
                "ActivityAnalyzer",
                "TokenScanner",
                "GraphBuilder",
                "SybilDetector",
                "ReputationEngine",
                "ContractAnalyzer",
                "SaaSTenantManager",
                "APIKeyGateway",
                "UsageMeter",
                "SubscriptionPlans"

            ]
        },


        timestamp:new Date().toISOString()

    };

}
