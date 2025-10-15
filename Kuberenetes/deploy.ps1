# OpenTelemetry Demo Kubernetes Deployment Script for Windows

Write-Host "Deploying OpenTelemetry Demo to Kubernetes..." -ForegroundColor Green

# Create service account
Write-Host "Creating service account..." -ForegroundColor Yellow
kubectl apply -f Serviceaccount.yaml

# Deploy ConfigMaps
Write-Host "Deploying ConfigMaps..." -ForegroundColor Yellow
kubectl apply -f configmaps.yaml

# Deploy infrastructure services
Write-Host "Deploying infrastructure services..." -ForegroundColor Yellow
kubectl apply -f otelcol/
kubectl apply -f valkey/

# Deploy core services
Write-Host "Deploying core services..." -ForegroundColor Yellow
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
Write-Host "Deploying frontend services..." -ForegroundColor Yellow
kubectl apply -f frontend/
kubectl apply -f frontend-proxy/

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
kubectl get pods
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Cyan
kubectl get service frontend-proxy
Write-Host ""
Write-Host "To access the frontend, use:" -ForegroundColor Magenta
Write-Host "kubectl port-forward service/frontend-proxy 8080:8080" -ForegroundColor White
Write-Host "Then visit: http://localhost:8080" -ForegroundColor White