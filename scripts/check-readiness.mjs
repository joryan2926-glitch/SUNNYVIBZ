import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

function loadEnvFile(fileName) {
  const filePath = path.join(root, fileName);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const requiredEnv = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const optionalEnv = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "RESEND_API_KEY",
  "ADMIN_NOTIFICATION_EMAIL",
];

const requiredTables = [
  "events",
  "artists",
  "gallery",
  "contact_messages",
  "workshops",
  "workshop_bookings",
  "sunny_friday_applications",
  "articles",
  "profiles",
  "subscription_plans",
  "user_subscriptions",
];

let hasBlockingIssue = false;

console.log("SUNNYVIBZ readiness check");
console.log("");

for (const key of requiredEnv) {
  const ok = Boolean(process.env[key]);
  console.log(`${ok ? "OK" : "ERREUR"} env ${key}`);
  hasBlockingIssue = hasBlockingIssue || !ok;
}

for (const key of optionalEnv) {
  const ok = Boolean(process.env[key]);
  console.log(`${ok ? "OK" : "À CONNECTER"} env ${key}`);
}

const schemaPath = path.join(root, "supabase", "schema.sql");
if (!fs.existsSync(schemaPath)) {
  console.error("ERREUR supabase/schema.sql introuvable");
  hasBlockingIssue = true;
} else {
  const schema = fs.readFileSync(schemaPath, "utf8");
  for (const table of requiredTables) {
    const ok = schema.includes(`public.${table}`);
    console.log(`${ok ? "OK" : "ERREUR"} schema ${table}`);
    hasBlockingIssue = hasBlockingIssue || !ok;
  }
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.exitCode = 1;
} else {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
      },
    },
  );

  console.log("");
  console.log("Tables Supabase distantes");

  for (const table of requiredTables) {
    const { error } = await supabase.from(table).select("*").limit(1);
    const ok = !error;
    console.log(`${ok ? "OK" : "MANQUANT"} remote ${table}${error ? ` - ${error.message}` : ""}`);
    hasBlockingIssue = hasBlockingIssue || !ok;
  }
}

console.log("");
if (hasBlockingIssue) {
  console.error("Statut: actions requises avant production complète.");
  process.exitCode = 1;
} else {
  console.log("Statut: socle technique prêt.");
}
