

import { getdata, putdata } from "./api.js"
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js"
import { findancestorbytype } from "./dom.js"

document.addEventListener( "DOMContentLoaded", async function() {

  document.getElementById( "addperson" ).addEventListener( "click", addpersoninput )
  await gopeople()
} )


/**
 * 
 * @returns { Promise< object > }
 */
async function fetchpeople() {
  return await getdata( "people" )
}

/**
 * @param { string } name
 * @param { string } email
 * @param { string } notes
 * @returns { Promise< object > }
 */
async function addperson( name, email, notes ) {
  await putdata( "people", { name, email, notes } )
}

/**
 * 
 * @param { string } id 
 * @param { string } name 
 * @param { string } email 
 * @param { string } notes 
 */
async function updateperson( id, name, email, notes ) {
  await putdata( "people", { id, name, email, notes } )
}



/**
 * @returns { Promise }
 */
async function gopeople() {
  const p = await fetchpeople()
  cleartablerows( "peopletable" )

  for( const pi in p ) {
    addpersondom( p[ pi ] )
  }
}

/**
 * 
 */
function addpersoninput() {

  clearform( "personform" )
  showform( "personform", async () => {

    const name = getformfieldvalue("personform-name");
    if (!name) {
      alert("Name is required.");
      return;
    }

    await addperson( getformfieldvalue( "personform-name" ), 
                      getformfieldvalue( "personform-email" ), 
                      getformfieldvalue( "personform-notes" ) )
    alert("Person added successfully!");
    await gopeople()
  } )
}

/**
 * 
 */
function editperson( ev ) {

  clearform( "personform" )
  const personrow = findancestorbytype( ev.target, "tr" )
  const person = personrow.person;

  setformfieldvalue( "personform-name", person.name )
  setformfieldvalue( "personform-email", person.email )
  setformfieldvalue( "personform-notes", person.notes )

  showform( "personform", async () => {
    //console.log("submitted peopleform") 

    const name = getformfieldvalue("personform-name");
    const email = getformfieldvalue("personform-email");
    const notes = getformfieldvalue("personform-notes");

    if (!name) {
      alert("Name is required.");
      return;
    }

    await updateperson(person.id, name, email, notes);
    alert("Person updated!");
    await gopeople();
  });

}

/**
 * 
 * @param { object } person
 */
export function addpersondom( person ) {

  const table = gettablebody( "peopletable" )
  const newrow = table.insertRow()

  const cells = []
  for( let i = 0; i < ( 2 + 7 ); i++ ) {
    cells.push( newrow.insertCell( i ) )
  }

  // @ts-ignore
  newrow.person = person
  cells[ 0 ].innerText = person.name

  const editbutton = document.createElement( "button" )
  editbutton.textContent = "Edit"
  editbutton.addEventListener( "click", editperson )

  cells[ 8 ].appendChild( editbutton )
}
