import { createTenant } from "./saas/tenantManager.js";
import { createApiKey } from "./saas/apiKeys.js";

const tenant = createTenant(
  "tenant-001",
  "Demo Enterprise"
);

const apiKey = createApiKey(
  tenant.id
);

console.log({
  tenant,
  apiKey
});
