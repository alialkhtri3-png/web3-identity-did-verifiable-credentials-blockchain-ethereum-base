#!/bin/bash

echo "🔧 Fixing V8.3 Enterprise Security Layer..."

# Backup
cp server.js server.js.backup.$(date +%s)

# Add adminAuth import if missing
grep -q 'adminAuth' server.js || \
sed -i '/import { adminRoutes }/a import { adminAuth } from "./saas/enterprise/adminAuth.js";' server.js


# Replace admin middleware section
python3 - <<'PY'
from pathlib import Path

p=Path("server.js")
s=p.read_text()

old='app.use(\n    "/api/admin",\n    adminRoutes\n);'

new='''app.use(
    "/api/admin",
    gateway
);

app.use(
    "/api/admin",
    adminAuth
);

app.use(
    "/api/admin",
    usageMiddleware
);

app.use(
    "/api/admin",
    adminRoutes
);'''

s=s.replace(old,new)

p.write_text(s)
PY


echo "✅ Syntax Check"

node --check server.js
node --check saas/enterprise/adminAuth.js
node --check saas/enterprise/adminRoutes.js


echo "🚀 Restarting Engine"

pkill node 2>/dev/null

nohup node server.js > engine.log 2>&1 &


sleep 2

echo "✅ V8.3 Enterprise Running"

curl -s \
-H "x-api-key: sk_kjcd51eugaf" \
http://localhost:3001/api/v1/status

