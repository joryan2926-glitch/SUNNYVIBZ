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

async function checkTable(table, label) {
  const { data, error } = await supabase.from(table).select("*").limit(3);

  if (error) {
    console.error(`${label}: ERREUR - ${error.message}`);
    return false;
  }

  console.log(`${label}: OK - ${data.length} élément(s) lisible(s)`);
  return true;
}

const checks = await Promise.all([
  checkTable("events", "events"),
  checkTable("artists", "artists"),
  checkTable("gallery", "gallery"),
]);

if (process.argv.includes("--write-contact")) {
  const { error } = await supabase.from("contact_messages").insert({
    name: "Test technique SUNNYVIBZ",
    email: "test@sunnyvibz.fr",
    subject: "Vérification formulaire",
    message: "Message de test généré par npm run supabase:check -- --write-contact",
  });

  if (error) {
    console.error(`contact_messages insert: ERREUR - ${error.message}`);
    checks.push(false);
  } else {
    console.log("contact_messages insert: OK");
    checks.push(true);
  }
}

if (checks.every(Boolean)) {
  console.log("Connexion Supabase vérifiée.");
} else {
  process.exitCode = 1;
}
