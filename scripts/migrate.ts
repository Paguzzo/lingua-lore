import dotenv from 'dotenv';

// Carregar variáveis de ambiente ANTES de importar qualquer coisa
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log("🚀 Starting database migrations...");

    // Read and execute the initial migration
    const migrationPath = join(__dirname, "..", "migrations", "0001_initial.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("📄 Executing migration: 0001_initial.sql");
    await pool.query(migrationSQL);

    console.log("✅ Database migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };