#!/bin/bash

echo "🚀 Deploying Complete OpenTelemetry Demo Application to Kubernetes"
echo "=================================================================="

# Navigate to the Kubernetes directory if not already there
cd "$(dirname "$0")"

echo "📋 Step 1: Applying ConfigMaps and ServiceAccount..."
kubectl apply -f configmaps.yaml
kubectl apply -f Serviceaccount.yaml

echo "📡 Step 2: Creating all services..."
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

echo "🔧 Step 3: Deploying infrastructure services..."
kubectl apply -f valkey/deploy.yaml
echo "✅ Valkey deployed"

kubectl apply -f flagd/deploy.yaml
echo "✅ FlagD deployed"

kubectl apply -f otelcol/deploy.yaml
echo "✅ OpenTelemetry Collector deployed"

echo "⏳ Waiting for infrastructure to stabilize..."
sleep 15

echo "🔧 Step 4: Deploying backend microservices..."
kubectl apply -f cart/deploy.yaml
echo "✅ Cart service deployed"

kubectl apply -f currency/deploy.yaml
echo "✅ Currency service deployed"

kubectl apply -f payment/deploy.yaml
echo "✅ Payment service deployed"

kubectl apply -f product-catalog/deploy.yaml
echo "✅ Product Catalog service deployed"

kubectl apply -f recommendation/deploy.yaml
echo "✅ Recommendation service deployed"

kubectl apply -f shipping/deploy.yaml
echo "✅ Shipping service deployed"

kubectl apply -f ad/deploy.yaml
echo "✅ Ad service deployed"

echo "⏳ Waiting for backend services to start..."
sleep 15

echo "🔧 Step 5: Deploying frontend services..."
kubectl apply -f checkout/deploy.yaml
echo "✅ Checkout service deployed"

kubectl apply -f frontend/deploy.yaml
echo "✅ Frontend service deployed"

kubectl apply -f image-provider/deploy.yaml
echo "✅ Image Provider deployed"

kubectl apply -f frontend-proxy/deploy.yaml
echo "✅ Frontend Proxy deployed"

echo "⏳ Waiting for frontend services to start..."
sleep 10

echo ""
echo "🎉 OpenTelemetry Demo Application Deployment Complete!"
echo "======================================================"

echo "📊 Current deployment status:"
kubectl get pods -o wide

echo ""
echo "📡 Services status:"
kubectl get services

echo ""
echo "🌐 To access your application:"
echo "1. Check if LoadBalancer has external IP:"
echo "   kubectl get service frontend-proxy"
echo ""
echo "2. If LoadBalancer is ready, access via external IP:"
echo "   http://<EXTERNAL-IP>:8080"
echo ""
echo "3. Or use port forwarding:"
echo "   kubectl port-forward service/frontend-proxy 8080:8080"
echo "   Then visit: http://localhost:8080"
echo ""
echo "🔍 Monitor deployment progress:"
echo "   kubectl get pods -w"
echo ""
echo "🐛 Check logs if any service fails:"
echo "   kubectl logs -l app=<service-name>"
echo ""
echo "📈 OpenTelemetry endpoints:"
echo "   - Collector: http://otelcol:4318 (OTLP HTTP)"
echo "   - Collector: http://otelcol:4317 (OTLP gRPC)"
echo "   - Zpages: kubectl port-forward service/otelcol 55679:55679"
echo ""
echo "🏁 Deployment completed successfully!"