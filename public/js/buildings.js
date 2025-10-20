import { getdata, putdata } from "./api.js";
import { showform, getformfieldvalue, setformfieldvalue, clearform, gettablebody, cleartablerows } from "./form.js";
import { findancestorbytype } from "./dom.js";

let landlordMap = {};
let currentBuildingId = null;
let deletedRoomIds = [];

/* add rooms */
const roomSection = document.getElementById("room-section");
const addRoomBtn = document.getElementById("add-room");
const roomTableBody = document.querySelector("#room-table tbody");


document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("addbuilding").addEventListener("click", addbuildinginput);

  document.querySelector(".close").addEventListener("click", async () => {
    await hideRoomSection();
    document.getElementById("buildingform").style.display = "none";
    document.getElementById("content").style.display = "block";
    await gobuildings();
  });

  await loadLandlordMap();
  await gobuildings();
});


async function fetchbuildings() {
  return await getdata("buildings");
}

async function addbuilding(name, address, postalcode, city, landlord_id) {
  const result = await putdata("buildings", { name, address, postalcode, city, landlord_id });
  return result.building?.id;
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
  currentBuildingId = null;
  clearform("buildingform")
  cleartablerows("room-table")
  await hideRoomSection()
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

    let buildingId;
    if (currentBuildingId) {
      await updatebuilding(currentBuildingId, name, address, postalcode, city, landlord_id);
      buildingId = currentBuildingId;
    } else {
      buildingId = await addbuilding(name, address, postalcode, city, landlord_id);
      if (!buildingId) {
        alert("Building failed to add!");
        return;
      }
    }
    /*
    const newBuildingId = await addbuilding(name, address, postalcode, city, landlord_id);
        
    if(!newBuildingId){
      alert("Building failed to add!");
      return
    }
    await saveRooms(newBuildingId);
    */
    await saveRooms(buildingId);
    alert("Building saved successfully!");
    currentBuildingId = null; // ✅ Reset after save
    await gobuildings();

    //await showRoomSection(newBuildingId)
    //await gobuildings()
  }, false);
}

async function editbuilding(ev) {
  clearform("buildingform");
  cleartablerows("room-table");

  deletedRoomIds = [];
  const buildingrow = findancestorbytype(ev.target, "tr");
  const building = buildingrow.building;
  currentBuildingId = building.id;

  await populateLandlordDropdown();

  setformfieldvalue("buildingform-name", building.name);
  setformfieldvalue("buildingform-address", building.address);
  setformfieldvalue("buildingform-postalcode", building.postalcode);
  setformfieldvalue("buildingform-city", building.city);
  setformfieldvalue("buildingform-postalcode", building.postalcode);
  setformfieldvalue("buildingform-landlord_id", building.landlord_id);

  await showRoomSection(building.id)

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
    alert('before saveRooms buildingId:' + building.id);
    await saveRooms(building.id);

    alert("Building and rooms updated!!!");

    await gobuildings();

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

/* load landlord dropdown in building detail */
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

/* load landlord name of building list */
async function loadLandlordMap() {
  const landlords = await getdata("landlords");
  landlordMap = {};
  for (const l of landlords) {
    landlordMap[l.id] = l.name;
  }
}

/* show room section */
async function showRoomSection(buildingId) {
  //const roomSection = document.getElementById("room-section");
  roomSection.style.display = "block";
  roomSection.dataset.buildingId = buildingId; // store for later use
  await loadRooms(buildingId);
}

async function hideRoomSection(buildingId) {
  //const roomSection = document.getElementById("room-section");
  roomSection.style.display = "none";
  roomSection.dataset.buildingId = null; // store for later use
  //roomSection.style.display = "block";
  //roomSection.dataset.buildingId = buildingId;
  //await loadRooms(buildingId);
}



/* Add Room section */
async function saveRooms(buildingId) {
  // Delete removed rooms
  for (const roomId of deletedRoomIds) {
    await deleteRoomFromDB(roomId);
  }
  deletedRoomIds = []; // Reset after deletion

  const rows = roomTableBody.querySelectorAll("tr");
  for (const row of rows) {
    const input = row.querySelector("input");
    const roomName = input.value.trim();
    const roomId = input.dataset.roomId;

    if (roomName) {
      const roomData = { name: roomName, building_id: buildingId };
      if (roomId) {
        roomData.id = roomId; // Update existing room
      }
      await saveRoomToDB(roomData);
    }
  }
}

async function saveRoomToDB(room) {
  if (room.id) {
    await fetch(`/api/rooms/${room.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room)
    });
  } else {
    await putdata("rooms", room); // Create new room
  }
}

addRoomBtn.addEventListener("click", () => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" class="room-name" placeholder="Room number or name" /></td>
    <td><button type="button" class="delete-room">Delete</button></td>
  `;

  roomTableBody.appendChild(row);
});


roomTableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-room")) {
    const row = e.target.closest("tr");
    const input = row.querySelector("input");
    const roomId = input.dataset.roomId;
    if (roomId) {
      deletedRoomIds.push(roomId); // Track for deletion
    }
    row.remove(); // Remove from UI
  }
});


async function deleteRoomFromDB(roomId) {
  console.log("Sending DELETE for room:", roomId);
  const response = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
  console.log("DELETE response status:", response.status);
  if (!response.ok) {
    alert("Failed to delete room " + roomId);
  }
}



async function loadRooms(buildingId) {
  const response = await fetch(`/api/rooms?building_id=${buildingId}`);
  const rooms = await response.json();

  cleartablerows("room-table");

  for (const room of rooms) {
    const row = document.createElement("tr");

    // Example: adjust based on your room schema
    row.innerHTML = `
      <td><input type="text" value="${room.name}" data-room-id="${room.id}" class="room-name-input" /></td>
      <td><button type="button" class="delete-room">Delete</button></td>
    `;

    roomTableBody.appendChild(row)
  }
}







