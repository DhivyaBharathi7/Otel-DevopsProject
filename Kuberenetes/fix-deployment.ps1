# Fix deployment script for PowerShell

Write-Host "🧹 Cleaning up failed deployments..." -ForegroundColor Yellow

# Delete all existing deployments to start fresh
kubectl delete deployment --all

# Wait for cleanup
Write-Host "⏳ Waiting for cleanup to complete..." -ForegroundColor Cyan
Start-Sleep 10

Write-Host "🚀 Applying fixed configurations..." -ForegroundColor Green

# Apply ConfigMaps first
kubectl apply -f configmaps.yaml

# Apply ServiceAccount
kubectl apply -f Serviceaccount.yaml

# Apply all services first
Write-Host "📡 Creating services..." -ForegroundColor Cyan
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

# Apply deployments in phases for stability
Write-Host "🔧 Phase 1: Infrastructure services..." -ForegroundColor Blue
kubectl apply -f valkey/deploy.yaml
kubectl apply -f flagd/deploy.yaml

Write-Host "⏳ Waiting for infrastructure..." -ForegroundColor Cyan
Start-Sleep 10

Write-Host "🔧 Phase 2: Core services..." -ForegroundColor Blue
kubectl apply -f otelcol/deploy.yaml
kubectl apply -f image-provider/deploy.yaml

Write-Host "⏳ Waiting for core services..." -ForegroundColor Cyan
Start-Sleep 10

Write-Host "🔧 Phase 3: Business services..." -ForegroundColor Blue
kubectl apply -f cart/deploy.yaml
kubectl apply -f currency/deploy.yaml
kubectl apply -f payment/deploy.yaml
kubectl apply -f product-catalog/deploy.yaml
kubectl apply -f recommendation/deploy.yaml
kubectl apply -f shipping/deploy.yaml

Write-Host "⏳ Waiting for business services..." -ForegroundColor Cyan
Start-Sleep 10

Write-Host "🔧 Phase 4: Frontend services..." -ForegroundColor Blue
kubectl apply -f checkout/deploy.yaml
kubectl apply -f ad/deploy.yaml
kubectl apply -f frontend/deploy.yaml
kubectl apply -f frontend-proxy/deploy.yaml

Write-Host "🎉 Deployment complete! Checking status..." -ForegroundColor Green
kubectl get pods
kubectl get services

Write-Host ""
Write-Host "🔍 To monitor the deployment progress:" -ForegroundColor Yellow
Write-Host "kubectl get pods -w" -ForegroundColor White
Write-Host ""
Write-Host "🌐 To access the frontend (once ready):" -ForegroundColor Yellow
Write-Host "kubectl port-forward service/frontend-proxy 8080:8080" -ForegroundColor White
Write-Host "Then visit: http://localhost:8080" -ForegroundColor White