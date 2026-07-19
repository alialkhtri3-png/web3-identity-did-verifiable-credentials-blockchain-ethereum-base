import { analyzeTimeline } from "./timelineAnalyzer.js";
import { ethers } from "ethers";
import { scanEvents } from "./eventScanner.js";
import { detectSybil } from "./sybilDetector.js";
import { calculateReputation } from "./reputationEngine.js";
import { analyzeEntities } from "./entityAnalyzer.js";
import { classifyIdentity } from "./aiClassifier.js";
import { scanMultiChain } from "./chains/multiChain.js";

const RPC =
process.env.BASE_RPC ||
"https://mainnet.base.org";

const provider =
new ethers.JsonRpcProvider(RPC);


export async function realScanWallet(wallet){

    const txCount =
    await provider.getTransactionCount(wallet);


    const balance =
    await provider.getBalance(wallet);


    const events = await scanEvents(wallet);

      const chains = await scanMultiChain(wallet);

    const timeline = analyzeTimeline({transactions:txCount});

      const sybil = detectSybil(wallet);

    const entities = analyzeEntities({
        transactions:txCount,
        tokens:events.tokens,
        connections:sybil.connections
    });

    const reputation = calculateReputation({
        transactions:txCount,
        tokens:events.tokens,
        connections:sybil.connections,

          graphScore:
          (
            (sybil.connections||0)*10 +
            (events.tokens||0)*5 +
            (txCount||0)*2
          ),

          cluster:
          {
            connections:sybil.connections||0,
            activityLevel:
            (txCount||0)>50
            ?"HIGH"
            :(txCount||0)>10
            ?"MEDIUM"
            :"LOW"
          },
        sybilRisk:sybil.sybilRisk
    });

    const aiIdentity = {
          category: txCount > 0 ? "Human Activity" : "Inactive",
          walletType: "EOA",
          riskLevel: sybil.sybilRisk,
          confidence: Math.min(100, txCount * 10 + events.tokens * 5)
      };

      return {

          timeline,

        wallet,
          entities,

        network:"MultiChain",

          chains: chains,

        transactions:txCount,

        tokens:0,

        connections:sybil.connections,

          graphScore:
          (
            (sybil.connections||0)*10 +
            (events.tokens||0)*5 +
            (txCount||0)*2
          ),

          cluster:
          {
            connections:sybil.connections||0,
            activityLevel:
            (txCount||0)>50
            ?"HIGH"
            :(txCount||0)>10
            ?"MEDIUM"
            :"LOW"
          },

        sybilScore:sybil.sybilScore,

        tokens:events.tokens,

        balance:
        ethers.formatEther(balance),

        reputation:reputation.reputation,

        trustLevel:reputation.trustLevel,

        sybilRisk:sybil.sybilRisk,

        identity:reputation.identity,

          aiIdentity

    };

}
