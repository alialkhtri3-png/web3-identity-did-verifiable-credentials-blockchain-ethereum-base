#!/data/data/com.termux/files/usr/bin/bash

echo "🔍 Sovereign Identity Engine Audit"

echo ""
echo "TODO/FIXME:"
grep -RIn "TODO\|FIXME" .

echo ""
echo "JavaScript files:"
find . -name "*.js" -o -name "*.mjs"

echo ""
echo "Dependencies:"
npm outdated

echo ""
echo "Git status:"
git status
