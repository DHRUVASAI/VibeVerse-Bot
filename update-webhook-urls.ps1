# PowerShell Script to Update Webhook URLs in Manifest Files
# Usage: .\update-webhook-urls.ps1 -DeployedUrl "https://your-app-url.railway.app"

param(
    [Parameter(Mandatory=$true)]
    [string]$DeployedUrl
)

# Remove trailing slash if present
$DeployedUrl = $DeployedUrl.TrimEnd('/')

Write-Host "🚀 Updating webhook URLs to: $DeployedUrl" -ForegroundColor Cyan
Write-Host ""

# Update plugin-manifest.json (Cliq Extension)
$cliqManifestPath = "plugin-manifest.json"
if (Test-Path $cliqManifestPath) {
    Write-Host "📝 Updating $cliqManifestPath..." -ForegroundColor Yellow
    
    $cliqContent = Get-Content $cliqManifestPath -Raw
    
    # Update all webhook URLs
    $cliqContent = $cliqContent -replace '"https://your-webhook-url\.com/bot/', "`"$DeployedUrl/bot/"
    $cliqContent = $cliqContent -replace 'http://localhost:5000/bot/', "$DeployedUrl/bot/"
    
    # Save updated content
    $cliqContent | Set-Content $cliqManifestPath -NoNewline
    
    Write-Host "✅ Updated Cliq manifest successfully!" -ForegroundColor Green
    Write-Host "   - Webhook base: $DeployedUrl/bot/" -ForegroundColor Gray
} else {
    Write-Host "❌ $cliqManifestPath not found!" -ForegroundColor Red
}

Write-Host ""

# Update salesiq-bot-config.json (SalesIQ Bot)
$salesiqConfigPath = "salesiq-bot-config.json"
if (Test-Path $salesiqConfigPath) {
    Write-Host "📝 Updating $salesiqConfigPath..." -ForegroundColor Yellow
    
    $salesiqContent = Get-Content $salesiqConfigPath -Raw
    
    # Update webhook URLs
    $salesiqContent = $salesiqContent -replace '"https://your-webhook-url\.com/api/salesiq/', "`"$DeployedUrl/api/salesiq/"
    $salesiqContent = $salesiqContent -replace 'http://localhost:5000/api/salesiq/', "$DeployedUrl/api/salesiq/"
    
    # Save updated content
    $salesiqContent | Set-Content $salesiqConfigPath -NoNewline
    
    Write-Host "✅ Updated SalesIQ config successfully!" -ForegroundColor Green
    Write-Host "   - Webhook base: $DeployedUrl/api/salesiq/" -ForegroundColor Gray
} else {
    Write-Host "❌ $salesiqConfigPath not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Webhook URLs updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test your backend: curl $DeployedUrl/api/health" -ForegroundColor White
Write-Host "2. Upload plugin-manifest.json to Zoho Cliq" -ForegroundColor White
Write-Host "3. Upload salesiq-bot-config.json to Zoho SalesIQ" -ForegroundColor White
Write-Host "4. Test bot commands in Cliq" -ForegroundColor White
Write-Host "5. Test conversation flows in SalesIQ" -ForegroundColor White
Write-Host ""
