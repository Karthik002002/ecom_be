import { exec } from "child_process";
import fs from "fs";
import path from "path";
import cron from "node-cron";
import { sequelize } from "../db/Config";

const DB_NAME = sequelize.getDatabaseName(); // Get database name from Sequelize
const DB_USER = sequelize.config.username;
const DB_PASSWORD = sequelize.config.password;
const BACKUP_DIR = path.join(__dirname, "backups");

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Function to create a backup
const backupDatabase = async () => {
  try {
    await sequelize.authenticate(); // Ensure DB is connected
    console.log("Database connected for backup...");

    const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");
    const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.sql`);

    const command = `mysqldump -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${backupFile}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Backup failed:", error);
      } else {
        console.log(`Backup saved: ${backupFile}`);
      }
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

// Schedule backup every 5 minutes
cron.schedule("*/5 * * * *", () => {
  console.log("Running database backup...");
  backupDatabase();
});

console.log("Backup service started...");
