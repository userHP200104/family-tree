// familyFilter.js

function computeExtendedFamily(personId) {
    const person = people.find(p => p.id === personId);
    if (!person) return new Set();
    let familySet = new Set();
    familySet.add(person.id);
    if (person.father) familySet.add(person.father);
    if (person.mother) familySet.add(person.mother);
    if (person.father) {
      const father = people.find(p => p.id === person.father);
      if (father) {
        if (father.father) familySet.add(father.father);
        if (father.mother) familySet.add(father.mother);
      }
    }
    if (person.mother) {
      const mother = people.find(p => p.id === person.mother);
      if (mother) {
        if (mother.father) familySet.add(mother.father);
        if (mother.mother) familySet.add(mother.mother);
      }
    }
    people.forEach(p => {
      if (p.father === person.id || p.mother === person.id) {
        familySet.add(p.id);
        people.forEach(gc => {
          if (gc.father === p.id || gc.mother === p.id) {
            familySet.add(gc.id);
          }
        });
      }
    });
    return familySet;
  }
  
  function applyFamilyFilter() {
    const select = document.getElementById("familySelect");
    if (!select.value) return;
    const extendedFamilySet = computeExtendedFamily(select.value);
    const filteredNodes = people.filter(p => extendedFamilySet.has(p.id)).map(p => ({
      id: p.id,
      label: p.fullname,
      shape: "box",
      color: { background: "#fff", border: "#000" },
      font: { color: "#000" }
    }));
    const allEdges = network.body.data.edges.get();
    const filteredEdges = allEdges.filter(edge => extendedFamilySet.has(edge.from) && extendedFamilySet.has(edge.to));
    const nodesDs = new vis.DataSet(filteredNodes);
    const edgesDs = new vis.DataSet(filteredEdges);
    network.setData({ nodes: nodesDs, edges: edgesDs });
    document.getElementById("clearFamilyFilterPageBtn").classList.remove("hidden");
  }
  
  function clearFamilyFilter() {
    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");
    setTimeout(() => {
      updateGraph();
      loader.classList.add("hidden");
      document.getElementById("clearFamilyFilterPageBtn").classList.add("hidden");
    }, 1000);
  }
  
  function populateFamilyDropdown() {
    const select = document.getElementById("familySelect");
    select.innerHTML = "";
    people.forEach(person => {
      const option = document.createElement("option");
      option.value = person.id;
      option.textContent = person.fullname;
      select.appendChild(option);
    });
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("openFamilyModalBtn").addEventListener("click", function() {
      populateFamilyDropdown();
      document.getElementById("familyModal").classList.remove("hidden");
    });
    document.getElementById("closeFamilyModalBtn").addEventListener("click", function() {
      document.getElementById("familyModal").classList.add("hidden");
    });
    document.getElementById("applyFamilyFilterBtn").addEventListener("click", function() {
      applyFamilyFilter();
      document.getElementById("familyModal").classList.add("hidden");
    });
    document.getElementById("clearFamilyFilterPageBtn").addEventListener("click", clearFamilyFilter);
  });
  