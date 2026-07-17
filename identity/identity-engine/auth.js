const validKeys = {
  "Dev_123": {
    plan: "Developer",
    limit: 100
  },
  "ent_999": {
    plan: "Enterprise",
    limit: 10000
  },
  "sk_kjcd51eugaf": {
    plan: "Enterprise",
    limit: 10000
  },
  "sk_3hhl0rh6hxf": {
    plan: "Enterprise",
    limit: 10000
  }
};

export function authorize(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || !validKeys[apiKey]) {
    return res.status(401).json({
      error: "Unauthorized: Invalid API Key"
    });
  }

  req.user = validKeys[apiKey];
  next();
}
