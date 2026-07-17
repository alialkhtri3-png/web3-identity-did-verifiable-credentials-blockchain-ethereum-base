#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Starting Sovereign Identity Engine..."

pm2 delete all >/dev/null 2>&1

sleep 2

pm2 start server.js --name sie-core

pm2 start gateway.js --name sie-gateway

pm2 save

sleep 5

echo "📡 Testing Gateway..."

curl -s -X POST http://localhost:3002/api/v1/identity/analyze \
-H "Content-Type: application/json" \
-H "x-api-key: dev_123" \
-d '{"wallet":"0xB6f450A4DB9144cBD917a286B1874F20B4b95248"}' | jq

echo "✅ Sovereign Identity Engine ONLINE"
