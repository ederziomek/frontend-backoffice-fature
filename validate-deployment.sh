#!/bin/bash

echo "🧪 VALIDAÇÃO FINAL DO DEPLOYMENT"
echo "================================"

INSTANCES=(
    "15.228.223.166"
    "15.228.232.199"
    "18.231.196.63"
    "56.125.31.36"
    "52.67.228.206"
)

LB_INSTANCES=("15.228.223.166" "18.231.196.63")

echo ""
echo "1. Testando instâncias individuais:"
for ip in "${INSTANCES[@]}"; do
    echo -n "   $ip: "
    if curl -s -f "http://$ip:3000/health" > /dev/null; then
        echo "✅ OK"
    else
        echo "❌ FAIL"
    fi
done

echo ""
echo "2. Testando load balancers:"
for lb_ip in "${LB_INSTANCES[@]}"; do
    echo -n "   LB $lb_ip: "
    if curl -s -f "http://$lb_ip/health" > /dev/null; then
        echo "✅ OK"
    else
        echo "❌ FAIL"
    fi
done

echo ""
echo "3. Testando distribuição de carga:"
for lb_ip in "${LB_INSTANCES[@]}"; do
    echo "   Load balancer $lb_ip:"
    for i in {1..5}; do
        response=$(curl -s "http://$lb_ip/" | grep -o "Server: [^<]*" || echo "No server info")
        echo "     Request $i: $response"
    done
done

echo ""
echo "✅ Validação concluída!"
