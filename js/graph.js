// js/graph.js

let network = null;

function updateGraph() {
  // First, resolve any relationships
  resolveRelationships();

  // Build nodes
  const nodesArray = people.map(person => ({
    id: person.id,
    label: person.fullname,
    shape: "box",
    color: { background: "#fff", border: "#000" },
    font: { color: "#000" }
  }));

  // Build edges for parent-child and spouse connections
  let edgesArray = [];
  people.forEach(person => {
    if (person.father) {
      edgesArray.push({ 
        id: person.father + "-" + person.id, 
        from: person.father, 
        to: person.id, 
        color: "#000" 
      });
    }
    if (person.mother) {
      edgesArray.push({ 
        id: person.mother + "-" + person.id, 
        from: person.mother, 
        to: person.id, 
        color: "#000" 
      });
    }
  });
  people.forEach(person => {
    if (person.spouse) {
      if (person.id < person.spouse) {
        // Use existing settings (e.g. connection style) if needed.
        // For simplicity, we keep spouse edges dashed.
        edgesArray.push({
          id: "spouse-" + person.id + "-" + person.spouse,
          from: person.id,
          to: person.spouse,
          color: { color: "#666" },
          dashes: [5, 5]
        });
      }
    }
  });

  // Create DataSets for vis-network
  const nodes = new vis.DataSet(nodesArray);
  const edges = new vis.DataSet(edgesArray);

  // Determine if the dataset is large.
  const isLargeDataset = people.length > 600; // adjust threshold as needed

  // Read collision radius setting (if provided by UI)
  let collisionRadius = 50;
  if (document.getElementById("collisionRadius")) {
    collisionRadius = parseInt(document.getElementById("collisionRadius").value, 10);
  }

  // Define network options based on dataset size.
  let options = {};
  if (isLargeDataset) {
    // For large datasets, use a hierarchical layout and disable physics for better performance.
    options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: "LR",       // Up-Down layout
          sortMethod: "directed" // try to maintain the directed flow
        }
      },
      physics: {
        enabled: false
      }
    };
  } else {
    // For smaller datasets, use a normal layout with physics.
    options = {
      layout: { randomSeed: 2 },
      physics: {
        stabilization: true,
        repulsion: { nodeDistance: 0 }
      }
    };
  }

  // Get the container element
  const container = document.getElementById("graph");

  // Create or update the network
  if (!network) {
    network = new vis.Network(container, { nodes, edges }, options);
    network.on("click", function(params) {
      if (params.nodes.length > 0) {
        openInfoModal(params.nodes[0]); // defined in modal.js
      }
    });
  } else {
    // Update network settings and data
    network.setOptions(options);
    network.setData({ nodes, edges });
  }
}

// Optionally, you could debounce updateGraph if many changes occur in rapid succession.
// For example:
let debounceTimeout;
function debouncedUpdateGraph() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(updateGraph, 300);
}

// On page load, call updateGraph
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("graph")) {
    updateGraph();
  }
});
