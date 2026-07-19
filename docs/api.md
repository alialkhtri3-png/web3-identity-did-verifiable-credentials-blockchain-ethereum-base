# Sovereign Identity Engine API

## Base URL

Local:

http://localhost:3001

## Status Endpoint

GET /api/status

Example:

{
 "status":"online",
 "engine":"Sovereign Identity Engine V13"
}

## Identity Scan

POST /api/identity

Request:

{
 "wallet":"0x..."
}

Response:

{
 "wallet":"0x...",
 "network":"Base",
 "identityScore":70,
 "reputation":"Established"
}

## Passport

Generate identity passport:

chain base passport <wallet>

## Credential

Generate credential:

chain base credential <wallet>

## Export

Export identity report:

chain base export <wallet>

## Verification

Credential verification includes:

- Hash validation
- Signature validation
- Issuer verification

## Version

V13.0.1
