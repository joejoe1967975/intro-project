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

/**
 * Delete a room by ID
 * @param {URL} parsedurl 
 * @param {string} method 
 * @returns {Promise<object>}
 */
async function remove(parsedurl, method) {
  const parts = parsedurl.pathname.split("/");
  const roomId = parts[parts.length - 1];

  if (!roomId) {
    return { error: "Missing room ID in URL" };
  }

  const stmt = db.prepare("DELETE FROM rooms WHERE id = ?");
  const info = stmt.run(roomId);

  return { success: info.changes > 0 };
}

/**
 * Update a room by ID
 * @param {URL} parsedurl 
 * @param {string} method 
 * @param {object} room 
 * @returns {Promise<object>}
 */
async function update(parsedurl, method, room) {
  const parts = parsedurl.pathname.split("/");
  const roomId = parts[parts.length - 1];

  const { name, building_id } = room;

  if (!roomId || !name || !building_id) {
    return { error: "Missing room ID, name, or building_id" };
  }

  const stmt = db.prepare("UPDATE rooms SET name = ?, building_id = ? WHERE id = ?");
  const info = stmt.run(name, building_id, roomId);

  return { success: info.changes > 0 };
}


module.exports = {
  add,
  get,
  remove,
  update
};
