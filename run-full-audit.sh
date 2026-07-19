#!/data/data/com.termux/files/usr/bin/bash

WALLET=$1

if [ -z "$WALLET" ]; then
echo "Usage: ./run-full-audit.sh WALLET_ADDRESS"
exit 1
fi

node wallet-final-audit.js $WALLET
