#!/bin/bash

echo "Applying critical fixes for OpenTelemetry services..."

echo "Step 1: Updating OpenTelemetry Collector configuration..."
kubectl apply -f configmaps.yaml

echo "Step 2: Applying cart service fixes..."
kubectl apply -f cart/deploy.yaml
kubectl apply -f cart/service.yaml

echo "Step 3: Applying checkout service fixes..."
kubectl apply -f checkout/deploy.yaml

echo "Step 4: Restarting OpenTelemetry Collector..."
kubectl apply -f otelcol/deploy.yaml

echo "Waiting for services to restart..."
sleep 30

echo "Current pod status:"
kubectl get pods

echo ""
echo "Service status:"
kubectl get services

echo ""
echo "To monitor progress:"
echo "kubectl get pods -w"