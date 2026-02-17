#!/bin/bash
# verify-setup.sh - Verify MobileDev is set up correctly

echo "🔍 Verifying MobileDev Setup..."
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "  ✗ Node.js not found. Install from https://nodejs.org"
    exit 1
fi
echo "  ✓ Node.js $(node -v)"

# Check apps/web
echo ""
echo "✓ Checking apps/web..."
if [ ! -d "apps/web" ]; then
    echo "  ✗ apps/web directory not found"
    exit 1
fi

if [ ! -f "apps/web/package.json" ]; then
    echo "  ✗ apps/web/package.json not found"
    exit 1
fi
echo "  ✓ apps/web exists"

# Check apps/relay
echo ""
echo "✓ Checking apps/relay..."
if [ ! -d "apps/relay" ]; then
    echo "  ✗ apps/relay directory not found"
    exit 1
fi

if [ ! -f "apps/relay/package.json" ]; then
    echo "  ✗ apps/relay/package.json not found"
    exit 1
fi
echo "  ✓ apps/relay exists"

# Check .env files
echo ""
echo "✓ Checking environment files..."
if [ ! -f "apps/web/.env.local" ]; then
    echo "  ⚠ apps/web/.env.local not found (create from .env.example)"
    cp apps/web/.env.example apps/web/.env.local
    echo "  ✓ Created .env.local"
else
    echo "  ✓ apps/web/.env.local exists"
fi

if [ ! -f "apps/relay/.env" ]; then
    echo "  ⚠ apps/relay/.env not found (creating default)"
    cat > apps/relay/.env << 'EOF'
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
GITHUB_API_URL=https://api.github.com
LOG_LEVEL=info
EOF
    echo "  ✓ Created .env"
else
    echo "  ✓ apps/relay/.env exists"
fi

# Check .github/copilot-instructions.md
echo ""
echo "✓ Checking documentation..."
if [ ! -f ".github/copilot-instructions.md" ]; then
    echo "  ✗ .github/copilot-instructions.md not found"
else
    echo "  ✓ .github/copilot-instructions.md exists"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup verification complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo ""
echo "1️⃣  Install dependencies:"
echo "    cd apps/web && npm install"
echo "    cd apps/relay && npm install"
echo ""
echo "2️⃣  Set up GitHub OAuth:"
echo "    - Go to https://github.com/settings/developers"
echo "    - Create a new OAuth App"
echo "    - Copy credentials to apps/web/.env.local"
echo ""
echo "3️⃣  Start the relay server (Terminal 1):"
echo "    cd apps/relay && npm start"
echo ""
echo "4️⃣  Start the Next.js app (Terminal 2):"
echo "    cd apps/web && npm run dev"
echo ""
echo "5️⃣  Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more info, see README.md or .github/copilot-instructions.md"
