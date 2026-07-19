# Sovereign Identity Engine API V12.0

## Health

GET /

Response:
{
"name":"Sovereign Identity Engine",
"version":"V12.0 Production",
"status":"running"
}


## Status

GET /api/status


## Identity Scan

POST /api/identity

Body:

{
 "wallet":"0xEthereumAddress"
}


## Modules

- Wallet Analyzer
- Transaction Scanner
- Token Scanner
- Contract Analyzer
- Graph Builder
- Sybil Detector
- Reputation Engine
- Verifiable Credential Engine
- Multi Chain Intelligence


## Security

- Wallet Validation
- Signature Verification
- JWT Authentication


## Enterprise

- Organizations
- Members
- Roles
- Permissions
- Billing
- API Keys
- Audit Logs

