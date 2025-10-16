#!/bin/bash

echo "Applying fixes for remaining service issues..."

echo "Step 1: Updating OpenTelemetry Collector configuration..."
kubectl apply -f configmaps.yaml

echo "Step 2: Restarting OpenTelemetry Collector..."
kubectl delete pod -l app=otelcol
kubectl apply -f otelcol/deploy.yaml

echo "Step 3: Updating recommendation service..."
kubectl apply -f recommendation/deploy.yaml

echo "Step 4: Restarting checkout service..."
kubectl delete pod -l app=checkout
kubectl apply -f checkout/deploy.yaml

echo "Step 5: Checking flagd service..."
kubectl apply -f flagd/deploy.yaml

echo "Waiting 30 seconds for services to restart..."
sleep 30

echo "Current status:"
kubectl get pods

echo ""
echo "Services with issues:"
kubectl get pods | grep -E "(Error|CrashLoop|Pending)"

echo ""
echo "Monitor progress with:"
echo "kubectl get pods -w"