const db = require("./db"); // adjust if your DB module has a different name

/**
 * Add a new room to the database
 * @param {URL} parsedurl 
 * @param {string} method 
 * @param {object} room 
 * @returns {Promise<object>}
 */
async function add(parsedurl, method, room) {
  const { name, building_id } = room;

  if (!name || !building_id) {
    return { error: "Missing room name or building_id" };
  }

  const stmt = db.prepare("INSERT INTO rooms (name, building_id) VALUES (?, ?)");
  const info = stmt.run(name, building_id);

  return { id: info.lastInsertRowid };
}

/**
 * Get all rooms (optionally filtered by building_id)
 * @param {URL} parsedurl 
 * @returns {Promise<object[]>}
 */
async function get(parsedurl) {
  const buildingId = parsedurl.searchParams.get("building_id");

  let rows;
  if (buildingId) {
    rows = db.prepare("SELECT * FROM rooms WHERE building_id = ?").all(buildingId);
  } else {
    rows = db.prepare("SELECT * FROM rooms").all();
  }

  return rows;
}

module.exports = {
  add,
  get
};
