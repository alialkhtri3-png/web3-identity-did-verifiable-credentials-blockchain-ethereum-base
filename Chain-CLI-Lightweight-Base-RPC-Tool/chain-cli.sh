#!/data/data/com.termux/files/usr/bin/bash

RPC_URL="https://mainnet.base.org"

NETWORK=$1
ACTION=$2
ADDRESS=$3

if [ "$NETWORK" != "base" ]; then
echo "Only Base network supported"
exit 1
fi

rpc(){
curl -s -X POST \
-H "Content-Type: application/json" \
--data "$1" \
$RPC_URL
}

case $ACTION in

block)
HEX=$(rpc '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
printf "Latest Block: %d\n" $HEX
;;

chainid)
HEX=$(rpc '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
printf "Chain ID: %d\n" $HEX
;;

balance)
HEX=$(rpc '{"jsonrpc":"2.0","method":"eth_getBalance","params":["'"$ADDRESS"'","latest"],"id":1}' | grep -o '"result":"[^"]*"' | cut -d'"' -f4)

WEI=$(printf "%d" $HEX)

ETH=$(echo "scale=6;$WEI/1000000000000000000" | bc)

echo "Address: $ADDRESS"
echo "Balance: $ETH ETH"
;;

wallet)

echo "=============================="
echo " Sovereign Wallet Report"
echo "=============================="

echo "Address:"
echo "$ADDRESS"

echo

HEX=$(rpc '{"jsonrpc":"2.0","method":"eth_getBalance","params":["'"$ADDRESS"'","latest"],"id":1}' | grep -o '"result":"[^"]*"' | cut -d'"' -f4)

WEI=$(printf "%d" $HEX)

ETH=$(echo "scale=6;$WEI/1000000000000000000" | bc)

echo "Network: Base"
echo "Balance: $ETH ETH"

BLOCK=$(rpc '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' | grep -o '"result":"[^"]*"' | cut -d'"' -f4)

printf "Current Block: %d\n" $BLOCK

echo
echo "Identity Engine:"
curl -s -X POST http://localhost:3001/api/identity \
-H "Content-Type: application/json" \
-d "{\"wallet\":\"$ADDRESS\",\"network\":\"base\"}"
echo "=============================="

;;

*)
echo "Usage:"
echo "chain base block"
echo "chain base chainid"
echo "chain base balance <address>"
echo "chain base wallet <address>"
;;

esac
