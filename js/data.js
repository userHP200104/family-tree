// data.js

// Global data arrays
let people = [];
const storageKey = "familyTreeData";

// Change log array
let changeLog = [];
const changeLogKey = "familyTreeChangeLog";

// Load people data from localStorage
function loadData() {
  const data = localStorage.getItem(storageKey);
  if (data) {
    people = JSON.parse(data);
  }
  const logData = localStorage.getItem(changeLogKey);
  if (logData) {
    changeLog = JSON.parse(logData);
  }
}

// Save people data to localStorage
function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(people));
}

// Save change log to localStorage
function saveChangeLog() {
  localStorage.setItem(changeLogKey, JSON.stringify(changeLog));
}

// Generate a unique ID
function generateId() {
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

// Add a change log entry
function addChangeLog(message) {
  const timestamp = new Date().toLocaleString();
  changeLog.push(`[${timestamp}] ${message}`);
  saveChangeLog();
}

// Add a new person
function addPerson(newPerson) {
  people.push(newPerson);
  addChangeLog(`Added person: ${newPerson.fullname} (ID: ${newPerson.id})`);
  saveData();
}

// Update an existing person (by id)
function updatePerson(updatedPerson) {
  const index = people.findIndex(p => p.id === updatedPerson.id);
  if (index > -1) {
    people[index] = updatedPerson;
    addChangeLog(`Updated person: ${updatedPerson.fullname} (ID: ${updatedPerson.id})`);
    saveData();
  }
}

// Resolve relationships for a person (if needed)
// In this implementation, we store relationship fields as IDs.
function resolveRelationships() {
  people.forEach(person => {
    // (You can add extra resolution logic here if needed)
    // In our table, the relationship fields already store the ID
  });
}

// Call loadData on script load
loadData();
