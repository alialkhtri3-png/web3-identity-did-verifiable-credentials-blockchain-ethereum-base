export function createDID(address){

 return {

 "@context":[
  "https://www.w3.org/ns/did/v1"
 ],

 id:
 `did:web:alialkhtri3-png.github.io:base-onchain-identity`,

 wallet:
 {
  chain:"eip155:8453",
  address
 }

 };

}
