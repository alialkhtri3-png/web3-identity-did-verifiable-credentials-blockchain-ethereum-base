function detectNFTSpam(tokens){

let risks=[];


for(const nft of tokens){

let text=
JSON.stringify(nft)
.toLowerCase();


if(
text.includes("claim") ||
text.includes("reward") ||
text.includes("airdrop")
){

risks.push({
token:nft.name,
reason:"Suspicious claim metadata"
});

}

}


return risks;

}


module.exports={
detectNFTSpam
};
