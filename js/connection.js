// connection.js

let overlayEdgeIds = [];

// Build the graph (adjacency list) from relationships (parent-child and spouse)
function buildGraph() {
  const graph = {};
  function addEdge(a, b) {
    if (!graph[a]) graph[a] = [];
    if (!graph[b]) graph[b] = [];
    if (!graph[a].includes(b)) graph[a].push(b);
    if (!graph[b].includes(a)) graph[b].push(a);
  }
  // Parent-child edges
  people.forEach(person => {
    if (person.father) {
      addEdge(person.father, person.id);
    }
    if (person.mother) {
      addEdge(person.mother, person.id);
    }
  });
  // Spouse edges
  people.forEach(person => {
    if (person.spouse) {
      addEdge(person.id, person.spouse);
    }
  });
  return graph;
}

// Find all shortest paths between two nodes using BFS (to get distances) and DFS (to collect all shortest paths)
function findAllShortestPaths(start, end, graph) {
  const distances = {};
  distances[start] = 0;
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    if (graph[node]) {
      for (const neighbor of graph[node]) {
        if (distances[neighbor] === undefined) {
          distances[neighbor] = distances[node] + 1;
          queue.push(neighbor);
        }
      }
    }
  }
  if (distances[end] === undefined) return [];
  const results = [];
  function dfs(current, path) {
    if (current === end) {
      results.push([...path]);
      return;
    }
    if (!graph[current]) return;
    for (const neighbor of graph[current]) {
      if (distances[neighbor] === distances[current] + 1) {
        path.push(neighbor);
        dfs(neighbor, path);
        path.pop();
      }
    }
  }
  dfs(start, [start]);
  return results;
}

// Highlight all connections (draw overlay edges on the network)
function highlightAllConnections(startId, endId) {
  clearConnectionOverlays();
  const graph = buildGraph();
  const paths = findAllShortestPaths(startId, endId, graph);
  if (paths.length === 0) {
    alert("No connection found.");
    return;
  }
  const pathColors = ["#ff0050", "#00aaff", "#ffaa00", "#aaff00", "#aa00ff", "#00ffaa"];
  let overlayEdges = [];
  paths.forEach((path, pathIndex) => {
    const color = pathColors[pathIndex % pathColors.length];
    for (let i = 0; i < path.length - 1; i++) {
      const edgeId = `overlay-${pathIndex}-${i}`;
      overlayEdges.push({
        id: edgeId,
        from: path[i],
        to: path[i + 1],
        color: { color: color },
        width: 3,
        smooth: { enabled: true, type: "curvedCW", roundness: 0.2 }
      });
      overlayEdgeIds.push(edgeId);
    }
  });
  network.body.data.edges.add(overlayEdges);
  document.getElementById("clearConnectionOverlaysBtn").classList.remove("hidden");
}

// Clear the connection overlay edges from the graph
function clearConnectionOverlays() {
  const allEdges = network.body.data.edges.get();
  allEdges.forEach(edge => {
    if (edge.id.startsWith("overlay-")) {
      network.body.data.edges.remove(edge.id);
    }
  });
  overlayEdgeIds = [];
  document.getElementById("clearConnectionOverlaysBtn").classList.add("hidden");
}

// Populate the dropdowns in the connection modal with the list of people
function populateConnectionDropdowns() {
  const dropdown1 = document.getElementById("connPerson1");
  const dropdown2 = document.getElementById("connPerson2");
  dropdown1.innerHTML = "";
  dropdown2.innerHTML = "";
  people.forEach(person => {
    const option = `<option value="${person.id}">${person.fullname}</option>`;
    dropdown1.innerHTML += option;
    dropdown2.innerHTML += option;
  });
}

// Wire up the connection modal event handlers
document.addEventListener("DOMContentLoaded", function() {
  const openConnBtn = document.getElementById("openConnectionModalBtn");
  const connModal = document.getElementById("connectionModal");
  const cancelConnBtn = document.getElementById("cancelConnectionBtn");
  const confirmConnBtn = document.getElementById("confirmConnectionBtn");

  openConnBtn.addEventListener("click", function() {
    populateConnectionDropdowns();
    connModal.classList.remove("hidden");
  });
  cancelConnBtn.addEventListener("click", function() {
    connModal.classList.add("hidden");
  });
  confirmConnBtn.addEventListener("click", function() {
    const person1 = document.getElementById("connPerson1").value;
    const person2 = document.getElementById("connPerson2").value;
    if (!person1 || !person2 || person1 === person2) {
      alert("Please select two different people.");
      return;
    }
    highlightAllConnections(person1, person2);
    connModal.classList.add("hidden");
  });
  
  // Clear connections button
  document.getElementById("clearConnectionOverlaysBtn").addEventListener("click", clearConnectionOverlays);
});
