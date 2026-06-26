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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

const checks = [
  ["events", "events"],
  ["artists", "artists actifs"],
  ["gallery", "gallery"],
  ["workshops", "workshops"],
  ["articles", "articles publiés"],
  ["subscription_plans", "subscription_plans actifs"],
  ["user_subscriptions", "user_subscriptions"],
];

const results = [];

for (const [table, label] of checks) {
  const { data, error } = await supabase.from(table).select("*").limit(3);

  if (error) {
    console.error(`${label}: ERREUR - ${error.message}`);
    results.push(false);
  } else {
    console.log(`${label}: OK - ${data.length} élément(s) lisible(s)`);
    results.push(true);
  }
}

if (results.every(Boolean)) {
  console.log("Plateforme Supabase avancée vérifiée.");
} else {
  console.error("Certaines tables avancées manquent. Exécute supabase/schema.sql dans Supabase SQL Editor.");
  process.exitCode = 1;
}
