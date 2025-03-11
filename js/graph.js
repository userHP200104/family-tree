// graph.js

let network = null;

function updateGraph() {
  // Build nodes from people array
  const nodesArray = people.map(person => ({
    id: person.id,
    label: person.fullname,
    shape: "box",
    color: { background: "#fff", border: "#000" },
    font: { color: "#000" }
  }));

  // Build edges with arrows for parent–child relationships
  let edgesArray = [];
  people.forEach(person => {
    if (person.father) {
      edgesArray.push({ 
        id: person.father + "-" + person.id, 
        from: person.father, 
        to: person.id, 
        color: "#000",
        arrows: { to: { enabled: true, scaleFactor: 1 } }
      });
    }
    if (person.mother) {
      edgesArray.push({ 
        id: person.mother + "-" + person.id, 
        from: person.mother, 
        to: person.id, 
        color: "#000",
        arrows: { to: { enabled: true, scaleFactor: 1 } }
      });
    }
  });
  people.forEach(person => {
    if (person.spouse) {
      if (person.id < person.spouse) {
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

  const isLargeDataset = people.length > 500;
  let collisionRadius = 50;
  if (document.getElementById("collisionRadius")) {
    collisionRadius = parseInt(document.getElementById("collisionRadius").value, 10);
  }

  let options = {};
  if (isLargeDataset) {
    options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed"
        }
      },
      physics: { enabled: false }
    };
  } else {
    options = {
      layout: { randomSeed: 2 },
      physics: {
        stabilization: true,
        repulsion: { nodeDistance: collisionRadius }
      }
    };
  }

  const container = document.getElementById("graph");
  const nodes = new vis.DataSet(nodesArray);
  const edges = new vis.DataSet(edgesArray);

  if (!network) {
    network = new vis.Network(container, { nodes, edges }, options);
    network.on("click", function(params) {
      if (params.nodes.length > 0) {
        openInfoModal(params.nodes[0]);
      }
    });
  } else {
    network.setOptions(options);
    network.setData({ nodes, edges });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("graph")) updateGraph();
});
