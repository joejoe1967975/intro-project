const buildings = [
  { id: 1, name: "", address: "", city: "", postalcode: "", landlord_id: "" },
  { id: 2, name: "", address: "", city: "", postalcode: "", landlord_id: "" },
]

const db = require("./db");

async function get( parsedurl ) {
  //return building
  const id = parsedurl.searchParams.get("id");

  if (id) {
    const building = db.prepare("SELECT * FROM buildings WHERE id = ?").get(id);
    return building || { error: "Building not found" };
  }

  return db.prepare("SELECT * FROM buildings").all();
}

async function add( parsedurl, method, building ) {
  const { id, name, address, city, postalcode, landlord_id } = building || {};

  console.log(building.id + ' ' + building.name + '  ' + building.address + '  ' + building.postalcode + '  ' + building.city + '  ' + building.landlord_id + '  ');
  if (!name || !address || !postalcode || !city || !landlord_id){return false}
console.log('add 1');

  if( undefined !== building.id ) {
    buildings.some( element => {
      if( element.id == building.id ) {
        element.name = building.name
        element.address = building.address
        element.postalcode = building.postalcode
        element.city = building.city
        element.landlord_id = building.landlord_id
        return true
      }
      return false
    } )
console.log('add update 2');
    const stmt = db.prepare("UPDATE buildings SET name = ?, address = ?, postalcode = ?, city = ?, landlord_id = ? WHERE id = ?");
    stmt.run(name, address, postalcode, city, landlord_id, id);
    return building
  }

  const stmt = db.prepare("INSERT INTO buildings (name, address, postalcode, city, landlord_id) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(name, address, postalcode, city, landlord_id);
  building.id = info.lastInsertRowid;

  return {building: { id: info.lastInsertRowid, name, address, postalcode, city, landlord_id }};
}

function getBuildingById(id) {
  return buildings.find(building => building.id === id);
}

module.exports = { 
  get,
  add,
  getBuildingById 
}
