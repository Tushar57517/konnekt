// =========================================================
// This script generates a random secret key for jwt for
// development.
// =========================================================

import crypto from "crypto";

console.log(`JWT SECRET KEY: ${crypto.randomBytes(32).toString("hex")}`);
