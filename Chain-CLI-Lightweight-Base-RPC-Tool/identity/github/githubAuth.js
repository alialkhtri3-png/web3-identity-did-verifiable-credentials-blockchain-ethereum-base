import jwt from "jsonwebtoken";
import fs from "fs";

export function createGitHubJWT(){

const privateKey =
fs.readFileSync("./github-private-key.pem","utf8");

const now=Math.floor(Date.now()/1000);

return jwt.sign(
{
iat: now - 60,
exp: now + 600,
iss: process.env.GITHUB_APP_ID
},
privateKey,
{
algorithm:"RS256"
}
);

}
