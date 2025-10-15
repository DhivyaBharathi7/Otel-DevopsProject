#!/bin/bash

echo "🔧 Fixing flagd and otelcol crashes..."

# Apply the fixed flagd deployment
kubectl apply -f flagd/deploy.yaml

# Apply the fixed otelcol deployment  
kubectl apply -f otelcol/deploy.yaml

echo "⏳ Waiting for pods to restart..."
sleep 15

echo "📊 Current pod status:"
kubectl get pods

echo ""
echo "🔍 To check logs if still failing:"
echo "kubectl logs -l app=flagd"
echo "kubectl logs -l app=otelcol"