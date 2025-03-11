// data.js

// Global variable to hold the people data
let people = [];

// Load data from the DB using our serverless function
async function loadDataFromDB() {
  try {
    const response = await fetch("/api/getData");
    const data = await response.json();
    people = data;
    // Update dependent views (graph, table, etc.)
    updateGraph();
    if (typeof populateTable === "function") populateTable();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadDataFromDB);
