import { getdata, putdata } from "./api.js";
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js";
import { findancestorbytype } from "./dom.js";

let landlordMap = {};

document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("addbuilding").addEventListener("click", addbuildinginput);
  await loadLandlordMap();
  await gobuildings();
});



async function fetchbuildings() {
  return await getdata("buildings");
}

async function addbuilding(name, address, postalcode, city, landlord_id) {
  await putdata("buildings", { name, address, postalcode, city, landlord_id });
}

async function updatebuilding(id, name, address, postalcode, city, landlord_id) {
  await putdata("buildings", { id, name, address, postalcode, city, landlord_id });
}

async function gobuildings() {

  const bl = await fetchbuildings();
  cleartablerows("buildingstable");

  for (const b of bl) {
    addbuildingdom(b);
  }
}

async function addbuildinginput() {

  console.log("Add Building clicked"); 
  
  clearform("buildingform")
  
  
  await populateLandlordDropdown();
  
  showform("buildingform", async () => {

    const name = getformfieldvalue("buildingform-name")
    const address = getformfieldvalue("buildingform-address")
    const postalcode = getformfieldvalue("buildingform-postalcode")
    const city = getformfieldvalue("buildingform-city")
    const landlord_id = getformfieldvalue("buildingform-landlord_id")

    if (!name || !address || !postalcode || !city || !landlord_id) {
      alert("Building name, address, postal code, city and landlord are required.");
      return;
    }

    await addbuilding(name, address, postalcode, city, landlord_id);
    alert("Building added successfully!");
    //await loadLandlordMap();
    await gobuildings()
    await showbuildingdetail(newBuilding.id); 
  }, false);
}

async function editbuilding(ev) {
  clearform("buildingform");
  
  const buildingrow = findancestorbytype(ev.target, "tr");
  const building = buildingrow.building;

  await populateLandlordDropdown();

  setformfieldvalue("buildingform-name", building.name);
  setformfieldvalue("buildingform-address", building.address);
  setformfieldvalue("buildingform-postalcode", building.postalcode);
  setformfieldvalue("buildingform-city", building.city);
  setformfieldvalue("buildingform-postalcode", building.postalcode);
  setformfieldvalue("buildingform-landlord_id", building.landlord_id);

  showform("buildingform", async () => {
    const name = getformfieldvalue("buildingform-name");
    const address = getformfieldvalue("buildingform-address");
    const city = getformfieldvalue("buildingform-city");
    const postalcode = getformfieldvalue("buildingform-postalcode");
    const landlord_id = getformfieldvalue("buildingform-landlord_id");

    if (!name || !address || !postalcode || !city || !landlord_id) {
      alert("Building name, address, postal code, city and landlord are required.");
      return;
    }

    await updatebuilding(building.id, name, address, postalcode, city, landlord_id);
    alert("Building updated!");
    //await loadLandlordMap();
    await gobuildings();
    //await showbuildingdetail(building.id);

  }, false);
}

export function addbuildingdom( building ) {
  const table = gettablebody("buildingstable");
  const newrow = table.insertRow();

  const nameCell = newrow.insertCell(0);
  const cityCell = newrow.insertCell(1);
  const landlordCell = newrow.insertCell(2);
  const actionCell = newrow.insertCell(3);

  newrow.building = building
  nameCell.innerText = building.name;
  cityCell.innerText = building.city;
  landlordCell.innerText = landlordMap[building.landlord_id] || "Unknown";

  const editbutton = document.createElement("button");
  editbutton.textContent = "Edit";
  editbutton.addEventListener("click", editbuilding);
  actionCell.appendChild(editbutton);
}



async function populateLandlordDropdown() {
  const select = document.getElementById("buildingform-landlord_id");
  select.innerHTML = `<option value="">Select a landlord</option>`; // Reset

  const landlords = await getdata("landlords");

  for (const l of landlords) {
    const option = document.createElement("option");
    option.value = l.id;
    option.textContent = l.name;
    select.appendChild(option);
  }
}



async function loadLandlordMap() {
  const landlords = await getdata("landlords");
  landlordMap = {};
  for (const l of landlords) {
    landlordMap[l.id] = l.name;
  }
}

async function showbuildingdetail(buildingId) {
  const building = await getdata(`buildings/${buildingId}`);
  clearform("buildingform");

  // Populate form fields
  setformfieldvalue("buildingform-name", building.name);
  setformfieldvalue("buildingform-address", building.address);
  setformfieldvalue("buildingform-postalcode", building.postalcode);
  setformfieldvalue("buildingform-city", building.city);
  setformfieldvalue("buildingform-landlord_id", building.landlord_id);

  // ✅ Show Add Room section
  document.getElementById("add-room-section").style.display = "block";

  /*
  showform("buildingform", async () => {
    // Save logic...
  });
  */
}
