#!/bin/bash

# OpenTelemetry Demo Kubernetes Deployment Script

echo "🚀 Deploying OpenTelemetry Demo to Kubernetes..."

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

# Deploy RBAC (Service Account, Roles, RoleBindings)
echo "🔐 Deploying RBAC configurations..."
kubectl apply -f rbac.yaml

# Deploy ConfigMaps
echo "⚙️ Deploying ConfigMaps..."
kubectl apply -f configmaps.yaml

# Deploy infrastructure services
echo "🏗️ Deploying infrastructure services..."
kubectl apply -f otelcol/
kubectl apply -f valkey/

# Deploy core services
echo "🔧 Deploying core services..."
kubectl apply -f flagd/
kubectl apply -f ad/
kubectl apply -f cart/
kubectl apply -f checkout/
kubectl apply -f currency/
kubectl apply -f payment/
kubectl apply -f product-catalog/
kubectl apply -f recommendation/
kubectl apply -f shipping/
kubectl apply -f image-provider/

# Deploy frontend services
echo "🌐 Deploying frontend services..."
kubectl apply -f frontend/
kubectl apply -f frontend-proxy/

echo "✅ Deployment complete!"
echo ""
echo "📋 Service Status:"
kubectl get pods -n opentelemetry-demo
echo ""
echo "🌍 Access the application:"
kubectl get service frontend-proxy -n opentelemetry-demo
echo ""
echo "💡 To access the frontend, use:"
echo "kubectl port-forward -n opentelemetry-demo service/frontend-proxy 8080:8080"
echo "Then visit: http://localhost:8080"