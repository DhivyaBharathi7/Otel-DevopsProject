# PowerShell script to deploy complete OpenTelemetry Demo Application to Kubernetes

Write-Host "🚀 Deploying Complete OpenTelemetry Demo Application to Kubernetes" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green

# Navigate to the Kubernetes directory if not already there
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "📋 Step 1: Applying ConfigMaps and ServiceAccount..." -ForegroundColor Yellow
kubectl apply -f configmaps.yaml
kubectl apply -f Serviceaccount.yaml

Write-Host "📡 Step 2: Creating all services..." -ForegroundColor Yellow
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

Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Cyan
Start-Sleep 5

Write-Host "🔧 Step 3: Deploying infrastructure services..." -ForegroundColor Blue
kubectl apply -f valkey/deploy.yaml
Write-Host "✅ Valkey deployed" -ForegroundColor Green

kubectl apply -f flagd/deploy.yaml
Write-Host "✅ FlagD deployed" -ForegroundColor Green

kubectl apply -f otelcol/deploy.yaml
Write-Host "✅ OpenTelemetry Collector deployed" -ForegroundColor Green

Write-Host "⏳ Waiting for infrastructure to stabilize..." -ForegroundColor Cyan
Start-Sleep 15

Write-Host "🔧 Step 4: Deploying backend microservices..." -ForegroundColor Blue
kubectl apply -f cart/deploy.yaml
Write-Host "✅ Cart service deployed" -ForegroundColor Green

kubectl apply -f currency/deploy.yaml
Write-Host "✅ Currency service deployed" -ForegroundColor Green

kubectl apply -f payment/deploy.yaml
Write-Host "✅ Payment service deployed" -ForegroundColor Green

kubectl apply -f product-catalog/deploy.yaml
Write-Host "✅ Product Catalog service deployed" -ForegroundColor Green

kubectl apply -f recommendation/deploy.yaml
Write-Host "✅ Recommendation service deployed" -ForegroundColor Green

kubectl apply -f shipping/deploy.yaml
Write-Host "✅ Shipping service deployed" -ForegroundColor Green

kubectl apply -f ad/deploy.yaml
Write-Host "✅ Ad service deployed" -ForegroundColor Green

Write-Host "⏳ Waiting for backend services to start..." -ForegroundColor Cyan
Start-Sleep 15

Write-Host "🔧 Step 5: Deploying frontend services..." -ForegroundColor Blue
kubectl apply -f checkout/deploy.yaml
Write-Host "✅ Checkout service deployed" -ForegroundColor Green

kubectl apply -f frontend/deploy.yaml
Write-Host "✅ Frontend service deployed" -ForegroundColor Green

kubectl apply -f image-provider/deploy.yaml
Write-Host "✅ Image Provider deployed" -ForegroundColor Green

kubectl apply -f frontend-proxy/deploy.yaml
Write-Host "✅ Frontend Proxy deployed" -ForegroundColor Green

Write-Host "⏳ Waiting for frontend services to start..." -ForegroundColor Cyan
Start-Sleep 10

Write-Host ""
Write-Host "🎉 OpenTelemetry Demo Application Deployment Complete!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

Write-Host "📊 Current deployment status:" -ForegroundColor Yellow
kubectl get pods -o wide

Write-Host ""
Write-Host "📡 Services status:" -ForegroundColor Yellow
kubectl get services

Write-Host ""
Write-Host "🌐 To access your application:" -ForegroundColor Yellow
Write-Host "1. Check if LoadBalancer has external IP:" -ForegroundColor White
Write-Host "   kubectl get service frontend-proxy" -ForegroundColor Gray
Write-Host ""
Write-Host "2. If LoadBalancer is ready, access via external IP:" -ForegroundColor White
Write-Host "   http://<EXTERNAL-IP>:8080" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Or use port forwarding:" -ForegroundColor White
Write-Host "   kubectl port-forward service/frontend-proxy 8080:8080" -ForegroundColor Gray
Write-Host "   Then visit: http://localhost:8080" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 Monitor deployment progress:" -ForegroundColor Yellow
Write-Host "   kubectl get pods -w" -ForegroundColor Gray
Write-Host ""
Write-Host "🐛 Check logs if any service fails:" -ForegroundColor Yellow
Write-Host "   kubectl logs -l app=<service-name>" -ForegroundColor Gray
Write-Host ""
Write-Host "📈 OpenTelemetry endpoints:" -ForegroundColor Yellow
Write-Host "   - Collector: http://otelcol:4318 (OTLP HTTP)" -ForegroundColor Gray
Write-Host "   - Collector: http://otelcol:4317 (OTLP gRPC)" -ForegroundColor Gray
Write-Host "   - Zpages: kubectl port-forward service/otelcol 55679:55679" -ForegroundColor Gray
Write-Host ""
Write-Host "🏁 Deployment completed successfully!" -ForegroundColor Green