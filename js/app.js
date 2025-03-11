// app.js

// --- Upload CSV Modal Functionality ---
document.getElementById("uploadCsvBtn").addEventListener("click", function() {
    document.getElementById("uploadModal").classList.remove("hidden");
  });
  document.getElementById("closeUploadModal").addEventListener("click", function() {
    document.getElementById("uploadModal").classList.add("hidden");
  });
  document.getElementById("cancelUploadBtn").addEventListener("click", function() {
    document.getElementById("uploadModal").classList.add("hidden");
  });
  document.getElementById("generateBtn").addEventListener("click", function() {
    const fileInput = document.getElementById("uploadCsvInput");
    if (fileInput.files.length === 0) {
      alert("Please select a CSV file.");
      return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      processCSVText(event.target.result);
      document.getElementById("uploadModal").classList.add("hidden");
    };
    reader.readAsText(file);
  });
  
  // --- Info Modal Close ---
  document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("personModal").classList.add("hidden");
  });
  
  // --- Edit Modal Close and Cancel ---
  document.getElementById("closeEditModal").addEventListener("click", function() {
    document.getElementById("editPersonModal").classList.add("hidden");
  });
  document.getElementById("cancelPersonForm").addEventListener("click", function() {
    document.getElementById("editPersonModal").classList.add("hidden");
  });
  
  // --- Add Person Button ---
  document.getElementById("addPersonBtn").addEventListener("click", function() {
    openEditModal(null);
  });
  
  // --- Clear Storage Button ---
  document.getElementById("clearStorageBtn").addEventListener("click", function() {
    if (confirm("Are you sure you want to clear all stored data?")) {
      localStorage.removeItem(storageKey);
      people = [];
      updateGraph();
    }
  });
  
  // --- Connection Modal Functionality ---
  document.getElementById("connectBtn").addEventListener("click", function () {
    if (people.length === 0) {
      alert("No people found in the tree. Please add people first.");
      return;
    }
    populateDropdowns();
    document.getElementById("connectModal").classList.remove("hidden");
  });
  document.getElementById("cancelConnect").addEventListener("click", function () {
    document.getElementById("connectModal").classList.add("hidden");
  });
  document.getElementById("confirmConnect").addEventListener("click", function () {
    const person1 = document.getElementById("person1Select").value;
    const person2 = document.getElementById("person2Select").value;
    if (!person1 || !person2 || person1 === person2) {
      alert("Please select two different people.");
      return;
    }
    highlightAllConnections(person1, person2);
    document.getElementById("connectModal").classList.add("hidden");
  });
  
  function populateDropdowns() {
    const dropdown1 = document.getElementById("person1Select");
    const dropdown2 = document.getElementById("person2Select");
    dropdown1.innerHTML = "";
    dropdown2.innerHTML = "";
    if (!people || people.length === 0) {
      dropdown1.innerHTML = `<option value="">No people available</option>`;
      dropdown2.innerHTML = `<option value="">No people available</option>`;
      return;
    }
    people.forEach(person => {
      const option = `<option value="${person.id}">${person.fullname}</option>`;
      dropdown1.innerHTML += option;
      dropdown2.innerHTML += option;
    });
  }
  
  // --- Clear Connection Overlays Button ---
  document.getElementById("clearConnectionBtn").addEventListener("click", clearConnectionOverlays);
  
  // --- Initialize on Page Load ---
  loadData();
  populateDatalist();
  updateGraph();
  