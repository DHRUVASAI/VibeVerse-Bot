# PowerShell Script to Push VibeVerse to GitHub
# Usage: .\push-to-github.ps1 -RepoUrl "https://github.com/USERNAME/REPO_NAME.git"

param(
    [Parameter(Mandatory=$false)]
    [string]$RepoUrl = ""
)

Write-Host "🚀 Pushing VibeVerse to GitHub" -ForegroundColor Cyan
Write-Host ""

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not initialized!" -ForegroundColor Red
    Write-Host "   Run: .\create-new-repo.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Check if repo URL is provided
if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
    Write-Host "📝 Please provide your GitHub repository URL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Example usage:" -ForegroundColor Gray
    Write-Host "  .\push-to-github.ps1 -RepoUrl 'https://github.com/DHRUVASAI/VibeVerse-Bot.git'" -ForegroundColor Cyan
    Write-Host ""
    
    $RepoUrl = Read-Host "Enter your GitHub repository URL"
    
    if ([string]::IsNullOrWhiteSpace($RepoUrl)) {
        Write-Host "❌ No repository URL provided. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📦 Repository URL: $RepoUrl" -ForegroundColor Gray
Write-Host ""

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $response = Read-Host "Do you want to update it? (y/n)"
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "🔄 Updating remote URL..." -ForegroundColor Yellow
        git remote set-url origin $RepoUrl
        Write-Host "✅ Remote updated" -ForegroundColor Green
    } else {
        Write-Host "❌ Keeping existing remote. Exiting." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "📎 Adding remote origin..." -ForegroundColor Yellow
    git remote add origin $RepoUrl
    Write-Host "✅ Remote added" -ForegroundColor Green
}

Write-Host ""

# Rename branch to main
Write-Host "🌿 Renaming branch to 'main'..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ Branch renamed" -ForegroundColor Green

Write-Host ""

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "✅ Successfully Pushed to GitHub!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎉 Your repository is now live on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your repository to verify files" -ForegroundColor White
    Write-Host "2. Add repository description and topics" -ForegroundColor White
    Write-Host "3. Deploy backend to Railway/Render" -ForegroundColor White
    Write-Host "4. Update webhook URLs" -ForegroundColor White
    Write-Host "5. Test bot in Cliq and SalesIQ" -ForegroundColor White
    Write-Host "6. Submit to Zoho Marketplace" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Failed to push to GitHub!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "• GitHub authentication required - run: gh auth login" -ForegroundColor White
    Write-Host "• Repository doesn't exist - create it on GitHub first" -ForegroundColor White
    Write-Host "• Wrong repository URL - check the URL" -ForegroundColor White
    Write-Host "• Network issues - check your internet connection" -ForegroundColor White
    Write-Host ""
    Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
}
