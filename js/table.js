// table.js

// --- Existing Functions: populateTable, populateDatalist, getOrCreatePerson ---
// (Assume that data.js provides generateId, addPerson, updatePerson, saveData, etc.)

function populateTable() {
    const tbody = document.getElementById("peopleTable").querySelector("tbody");
    tbody.innerHTML = "";
    people.forEach(person => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border px-2 py-1">${person.id}</td>
        <td class="border px-2 py-1">${person.fullname}</td>
        <td class="border px-2 py-1">${person.father || ""}</td>
        <td class="border px-2 py-1">${person.mother || ""}</td>
        <td class="border px-2 py-1">${person.spouse || ""}</td>
        <td class="border px-2 py-1">
          <button class="editBtn bg-blue-600 text-white px-2 py-1 rounded" data-id="${person.id}">Edit</button>
          <button class="deleteBtn bg-red-600 text-white px-2 py-1 rounded" data-id="${person.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    populateDatalist();
  }
  
  function populateDatalist() {
    const datalist = document.getElementById("peopleDatalist");
    datalist.innerHTML = "";
    people.forEach(person => {
      const option = document.createElement("option");
      option.value = person.fullname;
      datalist.appendChild(option);
    });
  }
  
  // Utility: get or create a person by full name. Optionally, if a relative relationship is specified,
  // for a spouse relative the new person gets linked back automatically.
  function getOrCreatePerson(fullName, relationshipType = "", sourceId = "", forceNew = false) {
    // Normalize the name
    fullName = fullName.trim().toUpperCase();
    if (!fullName) return "";
    
    // Find all existing records with the same name
    let duplicates = people.filter(p => p.fullname.toUpperCase() === fullName);
    
    // If duplicates exist and the caller hasn't forced a new record…
    if (duplicates.length > 0 && !forceNew) {
      // Ask the user whether to use the existing record.
      if (confirm("A person named '" + fullName + "' already exists. Click OK to use the existing record or Cancel to create a new one.")) {
        // If there are multiple duplicates, you might choose the first one or implement a more sophisticated selection
        return duplicates[0].id;
      }
      // If the user cancels, we force creation of a new record.
    }
    
    // To avoid naming conflicts, append a suffix if needed.
    let duplicateCount = people.filter(p => p.fullname.toUpperCase().startsWith(fullName)).length;
    let uniqueName = fullName;
    if (duplicateCount > 0) {
      uniqueName = fullName + " (" + (duplicateCount + 1) + ")";
    }
    
    // Split the unique name into common and family names.
    let commonName = uniqueName;
    let familyName = "";
    if (uniqueName.includes(" ")) {
      const parts = uniqueName.split(" ");
      commonName = parts[0];
      familyName = parts.slice(1).join(" ");
    }
    
    const newId = generateId();
    const newPerson = {
      id: newId,
      commonName: commonName,
      familyName: familyName,
      fullname: uniqueName,
      father: "",
      mother: "",
      spouse: ""
    };
    
    // For a spouse relationship, automatically link back.
    if (relationshipType === "spouse" && sourceId) {
      newPerson.spouse = sourceId;
    }
    
    addPerson(newPerson);
    saveData();
    return newId;
  }
  
  
  // --- New: Download CSV functionality ---
  function downloadCSV() {
    // Create CSV header
    let csvContent = "data:text/csv;charset=utf-8,ID,COMMON NAME,FAMILY NAME,FULLNAME,FATHER,MOTHER,SPOUSE\n";
    people.forEach(person => {
      let row = [person.id, person.commonName, person.familyName, person.fullname, person.father, person.mother, person.spouse].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "family_tree.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // --- New: Relative fields functionality ---
  function addRelativeField() {
    const container = document.getElementById("relativesContainer");
    // Create a container for this relative input row
    const div = document.createElement("div");
    div.classList.add("relativeRow", "flex", "space-x-2", "items-center", "mt-2");
    // Text input for relative's full name (uppercase enforced via CSS)
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Relative's Name";
    input.className = "border p-2 rounded flex-grow";
    input.style.textTransform = "uppercase";
    // Dropdown for relationship type
    const select = document.createElement("select");
    select.className = "border p-2 rounded";
    select.innerHTML = `<option value="sibling">Sibling</option><option value="child">Child</option>`;
    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.className = "bg-red-600 text-white px-2 py-1 rounded";
    removeBtn.addEventListener("click", function() {
      container.removeChild(div);
    });
    // Append elements to the div
    div.appendChild(input);
    div.appendChild(select);
    div.appendChild(removeBtn);
    // Append the row to the container
    container.appendChild(div);
  }
  
  // --- Modal open/close and form submission ---
  
  function openPersonModal(personId = null) {
    const modal = document.getElementById("personModal");
    const title = document.getElementById("personModalTitle");
    const form = document.getElementById("personForm");
    form.reset();
    form.dataset.editingId = "";
    // Clear any existing relative rows
    document.getElementById("relativesContainer").innerHTML = "";
    if (personId) {
      title.textContent = "Edit Person";
      const person = people.find(p => p.id === personId);
      if (person) {
        document.getElementById("formCommonName").value = person.commonName;
        document.getElementById("formFamilyName").value = person.familyName;
        // For relationship fields, show the full name (lookup by id)
        document.getElementById("formFather").value = person.father ? (people.find(p => p.id === person.father)?.fullname || "") : "";
        document.getElementById("formMother").value = person.mother ? (people.find(p => p.id === person.mother)?.fullname || "") : "";
        document.getElementById("formSpouse").value = person.spouse ? (people.find(p => p.id === person.spouse)?.fullname || "") : "";
        form.dataset.editingId = personId;
      }
    } else {
      title.textContent = "Add New Person";
    }
    modal.classList.remove("hidden");
  }
  
  function closePersonModal() {
    document.getElementById("personModal").classList.add("hidden");
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    populateTable();
  
    document.getElementById("openAddModalBtn").addEventListener("click", function() {
      openPersonModal();
    });
    document.getElementById("closePersonModalBtn").addEventListener("click", closePersonModal);
    document.getElementById("cancelPersonFormBtn").addEventListener("click", closePersonModal);
    document.getElementById("addRelativeBtn").addEventListener("click", addRelativeField);
    document.getElementById("downloadCsvBtn").addEventListener("click", downloadCSV);
  
    document.getElementById("personForm").addEventListener("submit", function(e) {
      e.preventDefault();
      // Force uppercase for each field
      const commonName = document.getElementById("formCommonName").value.trim().toUpperCase();
      const familyName = document.getElementById("formFamilyName").value.trim().toUpperCase();
      const fullname = commonName + (familyName ? " " + familyName : "");
      const fatherInput = document.getElementById("formFather").value.trim().toUpperCase();
      const motherInput = document.getElementById("formMother").value.trim().toUpperCase();
      const spouseInput = document.getElementById("formSpouse").value.trim().toUpperCase();
  
      const editingId = e.target.dataset.editingId;
  
      // Process basic relationship fields
      const fatherId = fatherInput ? getOrCreatePerson(fatherInput) : "";
      const motherId = motherInput ? getOrCreatePerson(motherInput) : "";
      // For spouse, if not existing, create and also link back automatically.
      // const spouseId = spouseInput ? getOrCreatePerson(spouseInput, "spouse", editingId || "temp") : "";
      const spouseId = spouseInput ? getOrCreatePerson(spouseInput, "spouse", "", false) : "";

  
      if (editingId) {
        // Edit mode
        const person = people.find(p => p.id === editingId);
        if (person) {
          person.commonName = commonName;
          person.familyName = familyName;
          person.fullname = fullname;
          person.father = fatherId;
          person.mother = motherId;
          person.spouse = spouseId;
          updatePerson(person);
        }
      } else {
        // Add mode
        const newId = generateId();
        const newPerson = {
          id: newId,
          commonName: commonName,
          familyName: familyName,
          fullname: fullname,
          father: fatherId,
          mother: motherId,
          spouse: spouseId
        };
        addPerson(newPerson);
      }
  
      // Process additional relative fields
      const relativeRows = document.querySelectorAll("#relativesContainer .relativeRow");
      relativeRows.forEach(row => {
        const relNameInput = row.querySelector("input").value.trim().toUpperCase();
        const relType = row.querySelector("select").value; // "sibling" or "child"
        if (!relNameInput) return;
        // If relative already exists, get their id; if not, create one.
        const relId = getOrCreatePerson(relNameInput);
        // Now update the relative's parent fields based on the type.
        if (relType === "child") {
          // For a child, set parent's id to the new person's id.
          // In edit mode, the "current" person is being updated; in add mode, use the newly created person.
          let parentId = editingId || newId;
          // Also, if the current person has a spouse, add that as well.
          let spouseForChild = "";
          if (spouseInput) {
            spouseForChild = getOrCreatePerson(spouseInput, "spouse", editingId || newId);
          }
          // Get the relative record and update parent fields if not already set.
          let relPerson = people.find(p => p.id === relId);
          if (relPerson) {
            // If parent's gender is not known, simply fill in both father and mother if available.
            // Here we assume the current person is one parent.
            // For child relative, we set:
            // - father = current person's id (if current person is assumed male) OR
            // - mother = current person's id (if current person is assumed female)
            // For simplicity, we set father = current person's id and, if a spouse exists, mother = spouse's id.
            // (You can adjust this logic as needed.)
            relPerson.father = parentId;
            if (spouseForChild) {
              relPerson.mother = spouseForChild;
            }
            updatePerson(relPerson);
          }
        } else if (relType === "sibling") {
          // For a sibling, copy parent's info from the current person.
          let relPerson = people.find(p => p.id === relId);
          if (relPerson) {
            // Set sibling's parents to be the same as the current person's parents.
            relPerson.father = fatherId;
            relPerson.mother = motherId;
            updatePerson(relPerson);
          }
        }
      });
  
      saveData();
      populateTable();
      closePersonModal();
    });
  
    // Delegate edit and delete button clicks in the table
    document.getElementById("peopleTable").addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains("editBtn")) {
        const personId = e.target.dataset.id;
        openPersonModal(personId);
      }
      if (e.target && e.target.classList.contains("deleteBtn")) {
        const personId = e.target.dataset.id;
        if (confirm("Are you sure you want to delete this person?")) {
          people = people.filter(p => p.id !== personId);
          addChangeLog(`Deleted person with ID: ${personId}`);
          // Remove any relationships referencing the deleted person.
          people.forEach(person => {
            if (person.father === personId) person.father = "";
            if (person.mother === personId) person.mother = "";
            if (person.spouse === personId) person.spouse = "";
          });
          saveData();
          populateTable();
        }
      }
    });
  });
  