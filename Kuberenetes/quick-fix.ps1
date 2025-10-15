# Quick fix script for PowerShell

Write-Host "🔧 Fixing flagd and otelcol crashes..." -ForegroundColor Yellow

# Apply the fixed flagd deployment
kubectl apply -f flagd/deploy.yaml

# Apply the fixed otelcol deployment  
kubectl apply -f otelcol/deploy.yaml

Write-Host "⏳ Waiting for pods to restart..." -ForegroundColor Cyan
Start-Sleep 15

Write-Host "📊 Current pod status:" -ForegroundColor Green
kubectl get pods

Write-Host ""
Write-Host "🔍 To check logs if still failing:" -ForegroundColor Yellow
Write-Host "kubectl logs -l app=flagd" -ForegroundColor White
Write-Host "kubectl logs -l app=otelcol" -ForegroundColor White