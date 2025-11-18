# VibeVerse - Update Webhook URLs Script
# Run this after deploying to update all webhook URLs

param(
    [Parameter(Mandatory=$true)]
    [string]$DeployedURL
)

# Remove trailing slash if present
$DeployedURL = $DeployedURL.TrimEnd('/')

Write-Host "🔧 Updating webhook URLs to: $DeployedURL" -ForegroundColor Cyan
Write-Host ""

# Files to update
$pluginManifest = "plugin-manifest.json"
$salesiqConfig = "salesiq-bot-config.json"

# Update plugin-manifest.json
if (Test-Path $pluginManifest) {
    Write-Host "📝 Updating $pluginManifest..." -ForegroundColor Yellow
    
    $content = Get-Content $pluginManifest -Raw
    
    # Replace localhost URLs with deployed URL
    $content = $content -replace 'http://localhost:5000', $DeployedURL
    $content = $content -replace 'https://localhost:5000', $DeployedURL
    
    $content | Set-Content $pluginManifest -NoNewline
    Write-Host "✅ Updated $pluginManifest" -ForegroundColor Green
} else {
    Write-Host "⚠️  $pluginManifest not found" -ForegroundColor Red
}

Write-Host ""

# Update salesiq-bot-config.json
if (Test-Path $salesiqConfig) {
    Write-Host "📝 Updating $salesiqConfig..." -ForegroundColor Yellow
    
    $content = Get-Content $salesiqConfig -Raw
    
    # Replace localhost URLs with deployed URL
    $content = $content -replace 'http://localhost:5000', $DeployedURL
    $content = $content -replace 'https://localhost:5000', $DeployedURL
    
    $content | Set-Content $salesiqConfig -NoNewline
    Write-Host "✅ Updated $salesiqConfig" -ForegroundColor Green
} else {
    Write-Host "⚠️  $salesiqConfig not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Webhook URLs updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push changes: git add . && git commit -m 'Update webhook URLs' && git push"
Write-Host "2. Test health endpoint: curl $DeployedURL/api/health"
Write-Host "3. Install extension in Cliq or configure bot in SalesIQ"
Write-Host "4. Test bot commands"
Write-Host ""
