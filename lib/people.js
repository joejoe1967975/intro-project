


/**
 * @typedef { Object } person
 * @property { number } id
 * @property { string } name - The name of the person.
 * @property { string } email - The email address of the person.
 * @property { string } [ notes ] - Additional notes about the person (optional).
 */

/**
 * @type { Array< person > }
 */
const people = [
  { id: 1, name: "Kermit Frog", email: "", notes:"" },
  { id: 2, name: "Miss Piggy", email: "", notes:"" },
]
const db = require("./db");
/**
 * Demo function to return an array of people objects
 * @param { URL } parsedurl 
 * @returns { Promise< Array< person > > }
 */
async function get( parsedurl ) {
  //return people
  const id = parsedurl.searchParams.get("id");
  if (id) {
    const person = db.prepare("SELECT * FROM people WHERE id = ?").get(id);
    return person || { error: "Person not found" };
  }
  return db.prepare("SELECT * FROM people").all();
}

/**
 * Demo function adding a person
 * @param { string } parsedurl
 * @param { string } method
 * @param { person } person
 * @return { Promise < object > }
 */
async function add( parsedurl, method, person ) {
  const { id, name, email, notes } = person || {};

  if (!person.name){return false}

  if( undefined !== person.id ) {
    people.some( element => {
      if( element.id == person.id ) {
        element.name = person.name
        element.email = person.email
        element.notes = person.notes
        return true
      }
      return false
    } )
    const stmt = db.prepare("UPDATE people SET name = ?, email = ?, notes = ? WHERE id = ?");
    stmt.run(name, email, notes, id);
    return person
  }

  const stmt = db.prepare("INSERT INTO people (name, email, notes) VALUES (?, ?, ?)");
  const info = stmt.run(name, email, notes);
  person.id = info.lastInsertRowid;

  /*
  person.id = people.reduce( ( maxid, obj ) => {
    return Math.max( maxid, obj.id )
  }, -Infinity ) + 1
  
  people.push( person )

  return person
  */
  
  return {person: { id: info.lastInsertRowid, name, email, notes }};
  
}

function getPersonById(id) {
  return people.find(person => person.id === id);
}

module.exports = {
  get,
  add,
  getPersonById 
}