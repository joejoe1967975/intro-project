


/**
 * @typedef { Object } landlord
 * @property { number } id
 * @property { string } name - The name of the landlord.
 * @property { string } email - The email address of the landlord. */

/**
 * @type { Array< landlord > }
 */
const landlords = [
  { id: 1, name: "Kermit Frog", email: "" },
  { id: 2, name: "Miss Piggy", email: "" },
]
const db = require("./db");
/**
 * Demo function to return an array of landlord objects
 * @param { URL } parsedurl 
 * @returns { Promise< Array< landlord > > }
 */
async function get( parsedurl ) {
  //return people
  const id = parsedurl.searchParams.get("id");

  if (id) {
    const landlord = db.prepare("SELECT * FROM landlords WHERE id = ?").get(id);
    return landlord || { error: "Landlord not found" };
  }

  return db.prepare("SELECT * FROM landlords").all();
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { landlord } landlord
 * @return { Promise < object > }
 */
async function add( parsedurl, method, landlord ) {
  const { id, name, email } = landlord || {};

  if (!landlord.name){return false}

  if( undefined !== landlord.id ) {
    landlords.some( element => {
      if( element.id == landlord.id ) {
        element.name = landlord.name
        element.email = landlord.email
        return true
      }
      return false
    } )
    const stmt = db.prepare("UPDATE landlords SET name = ?, email = ? WHERE id = ?");
    stmt.run(name, email, id);
    return landlord
  }

  const stmt = db.prepare("INSERT INTO landlords (name, email) VALUES (?, ?)");
  const info = stmt.run(name, email);
  landlord.id = info.lastInsertRowid;

  /*
  person.id = people.reduce( ( maxid, obj ) => {
    return Math.max( maxid, obj.id )
  }, -Infinity ) + 1
  
  people.push( person )

  return person
  */
  
  return {landlord: { id: info.lastInsertRowid, name, email }};
  
}

function getLandlordById(id) {
  return landlords.find(landlord => landlord.id === id);
}

module.exports = {
  get,
  add,
  getLandloardById 
}