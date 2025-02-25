import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";

export const initDB = async () => {
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  const db = await sqlite.createConnection(
    "todoDB",
    false,
    "no-encryption",
    1,
    false
  );
  await db.open();

  await db.execute(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            dueDate TEXT,
            completedAt TEXT,
            status TEXT CHECK(status IN ('in_progress', 'completed', 'canceled', 'urgent', 'waiting'))
        );
    `);

  return db;
};
