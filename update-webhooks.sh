#!/bin/bash

# VibeVerse - Update Webhook URLs Script
# Run this after deploying to update all webhook URLs

if [ -z "$1" ]; then
    echo "Usage: ./update-webhooks.sh <DEPLOYED_URL>"
    echo "Example: ./update-webhooks.sh https://vibeverse-bot.railway.app"
    exit 1
fi

DEPLOYED_URL="${1%/}"  # Remove trailing slash

echo "🔧 Updating webhook URLs to: $DEPLOYED_URL"
echo ""

# Update plugin-manifest.json
if [ -f "plugin-manifest.json" ]; then
    echo "📝 Updating plugin-manifest.json..."
    sed -i.bak "s|http://localhost:5000|$DEPLOYED_URL|g" plugin-manifest.json
    sed -i.bak "s|https://localhost:5000|$DEPLOYED_URL|g" plugin-manifest.json
    rm plugin-manifest.json.bak 2>/dev/null
    echo "✅ Updated plugin-manifest.json"
else
    echo "⚠️  plugin-manifest.json not found"
fi

echo ""

# Update salesiq-bot-config.json
if [ -f "salesiq-bot-config.json" ]; then
    echo "📝 Updating salesiq-bot-config.json..."
    sed -i.bak "s|http://localhost:5000|$DEPLOYED_URL|g" salesiq-bot-config.json
    sed -i.bak "s|https://localhost:5000|$DEPLOYED_URL|g" salesiq-bot-config.json
    rm salesiq-bot-config.json.bak 2>/dev/null
    echo "✅ Updated salesiq-bot-config.json"
else
    echo "⚠️  salesiq-bot-config.json not found"
fi

echo ""
echo "🎉 Webhook URLs updated successfully!"
echo ""
echo "Next steps:"
echo "1. Commit and push changes: git add . && git commit -m 'Update webhook URLs' && git push"
echo "2. Test health endpoint: curl $DEPLOYED_URL/api/health"
echo "3. Install extension in Cliq or configure bot in SalesIQ"
echo "4. Test bot commands"
echo ""
