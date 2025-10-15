const Database = require("better-sqlite3");
const db = new Database("data.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    notes TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS landlords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    postalcode TEXT,
    city TEXT,
    landlord_id INTEGER,
    FOREIGN KEY (landlord_id) REFERENCES landlords(id)
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    building_id INTEGER,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
  );
`);




module.exports = db;
