#!/bin/bash

echo "🧹 Cleaning up failed deployments..."

# Delete all existing deployments to start fresh
kubectl delete deployment --all

# Wait for cleanup
echo "⏳ Waiting for cleanup to complete..."
sleep 10

echo "🚀 Applying fixed configurations..."

# Apply ConfigMaps first
kubectl apply -f configmaps.yaml

# Apply ServiceAccount
kubectl apply -f Serviceaccount.yaml

# Apply all services first
echo "📡 Creating services..."
kubectl apply -f ad/service.yaml
kubectl apply -f cart/service.yaml
kubectl apply -f checkout/service.yaml
kubectl apply -f currency/service.yaml
kubectl apply -f flagd/service.yaml
kubectl apply -f frontend/service.yaml
kubectl apply -f frontend-proxy/service.yaml
kubectl apply -f image-provider/service.yaml
kubectl apply -f otelcol/service.yaml
kubectl apply -f payment/service.yaml
kubectl apply -f product-catalog/service.yaml
kubectl apply -f recommendation/service.yaml
kubectl apply -f shipping/service.yaml
kubectl apply -f valkey/service.yaml

echo "⏳ Waiting for services to be ready..."
sleep 5

# Apply deployments in phases for stability
echo "🔧 Phase 1: Infrastructure services..."
kubectl apply -f valkey/deploy.yaml
kubectl apply -f flagd/deploy.yaml

echo "⏳ Waiting for infrastructure..."
sleep 10

echo "🔧 Phase 2: Core services..."
kubectl apply -f otelcol/deploy.yaml
kubectl apply -f image-provider/deploy.yaml

echo "⏳ Waiting for core services..."
sleep 10

echo "🔧 Phase 3: Business services..."
kubectl apply -f cart/deploy.yaml
kubectl apply -f currency/deploy.yaml
kubectl apply -f payment/deploy.yaml
kubectl apply -f product-catalog/deploy.yaml
kubectl apply -f recommendation/deploy.yaml
kubectl apply -f shipping/deploy.yaml

echo "⏳ Waiting for business services..."
sleep 10

echo "🔧 Phase 4: Frontend services..."
kubectl apply -f checkout/deploy.yaml
kubectl apply -f ad/deploy.yaml
kubectl apply -f frontend/deploy.yaml
kubectl apply -f frontend-proxy/deploy.yaml

echo "🎉 Deployment complete! Checking status..."
kubectl get pods
kubectl get services

echo ""
echo "🔍 To monitor the deployment progress:"
echo "kubectl get pods -w"
echo ""
echo "🌐 To access the frontend (once ready):"
echo "kubectl port-forward service/frontend-proxy 8080:8080"
echo "Then visit: http://localhost:8080"