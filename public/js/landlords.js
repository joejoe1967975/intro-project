import { getdata, putdata } from "./api.js";
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js";
import { findancestorbytype } from "./dom.js";

document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("addlandlord").addEventListener("click", addlandlordinput);
  await golandlords();
});


/**
 * 
 * @returns { Promise< object > }
 */
async function fetchlandlords() {
  return await getdata( "landlords" )
}

/**
 * @param { string } name
 * @param { string } email
 * @returns { Promise< object > }
 */
async function addlandlord(name, email) {
  await putdata("landlords", { name, email });
}

/**
 * 
 * @param { string } id 
 * @param { string } name 
 * @param { string } email 
 */
async function updatelandlord(id, name, email) {
  await putdata("landlords", { id, name, email });
}

/**
 * @returns { Promise }
 */
async function golandlords() {
    
  const l = await fetchlandlords();
  
  cleartablerows("landlordstable")

  
  for (const la in l) {
    addlandlorddom(l[ la ])
  }

}

function addlandlordinput() {

  //console.log("Add Landlord clicked");

  clearform("landlordform")
  showform("landlordform", async () => {

    const name = getformfieldvalue("landlordform-name");
    if (!name) {
      alert("Name is required.");
      return;
    }

    await addlandlord(  getformfieldvalue( "landlordform-name" ), 
                        getformfieldvalue("landlordform-email") )
    alert("Landlord added successfully!");
    await golandlords()
  })
}

function editlandlord(ev) {
  clearform("landlordform");
  const landlordrow = findancestorbytype(ev.target, "tr");
  const landlord = landlordrow.landlord;

  setformfieldvalue("landlordform-name", landlord.name);
  setformfieldvalue("landlordform-email", landlord.email);

  showform("landlordform", async () => {
    //console.log("submitted landlordform") 

    const name = getformfieldvalue("landlordform-name");
    const email = getformfieldvalue("landlordform-email");

    if (!name) {
      alert("Name is required.");
      return;
    }

    await updatelandlord(landlord.id, name, email);
    alert("Landlord updated!");
    await golandlords();
  });
}

export function addlandlorddom( landlord ) {
  const table = gettablebody("landlordstable");
  const newrow = table.insertRow();

  const nameCell = newrow.insertCell(0);
  const emailCell = newrow.insertCell(1);
  const actionCell = newrow.insertCell(2);

  // @ts-ignore
  newrow.landlord = landlord
  nameCell.innerText = landlord.name;
  emailCell.innerText = landlord.email;

  const editbutton = document.createElement("button");
  editbutton.textContent = "Edit";
  editbutton.addEventListener("click", editlandlord);
  actionCell.appendChild(editbutton);
}
