// modal.js

// Open person info modal when a node is clicked.
function openInfoModal(personId) {
    const person = people.find(p => p.id === personId);
    if (!person) return;
    // Compute relationship details
    const relatives = computeFullRelatives(person);
    const infoHTML = `
      <p><strong>Full Name:</strong> ${person.fullname}</p>
      <p><strong>Parents:</strong> ${relatives.parents.join(", ") || "N/A"}</p>
      <p><strong>Spouse:</strong> ${relatives.spouse || "N/A"}</p>
      <p><strong>Children:</strong> ${relatives.children.join(", ") || "N/A"}</p>
      <p><strong>Siblings:</strong> ${relatives.siblings.join(", ") || "N/A"}</p>
      <p><strong>Grandparents:</strong> ${relatives.grandparents.join(", ") || "N/A"}</p>
    `;
    document.getElementById("modalTitle").textContent = "Person Information";
    document.getElementById("modalContent").innerHTML = infoHTML;
    // No Edit button provided.
    document.getElementById("personModal").classList.remove("hidden");
  }
  
  function closeInfoModal() {
    document.getElementById("personModal").classList.add("hidden");
  }
  
  // Compute full relatives (as before)
  function computeFullRelatives(person) {
    let relatives = {};
    relatives.parents = [];
    if (person.father) {
      const p = people.find(p => p.id === person.father);
      if (p) relatives.parents.push(p.fullname);
    }
    if (person.mother) {
      const p = people.find(p => p.id === person.mother);
      if (p) relatives.parents.push(p.fullname);
    }
    relatives.spouse = "";
    if (person.spouse) {
      const sp = people.find(p => p.id === person.spouse);
      if (sp) relatives.spouse = sp.fullname;
    }
    relatives.children = people.filter(p => p.father === person.id || p.mother === person.id)
                                .map(p => p.fullname);
    relatives.siblings = people.filter(p => p.id !== person.id && (
      (p.father && p.father === person.father) || (p.mother && p.mother === person.mother)
    )).map(p => p.fullname);
    relatives.grandparents = [];
    if (person.father) {
      const father = people.find(p => p.id === person.father);
      if (father) {
        if (father.father) {
          const gp = people.find(p => p.id === father.father);
          if (gp) relatives.grandparents.push(gp.fullname);
        }
        if (father.mother) {
          const gp = people.find(p => p.id === father.mother);
          if (gp) relatives.grandparents.push(gp.fullname);
        }
      }
    }
    if (person.mother) {
      const mother = people.find(p => p.id === person.mother);
      if (mother) {
        if (mother.father) {
          const gp = people.find(p => p.id === mother.father);
          if (gp) relatives.grandparents.push(gp.fullname);
        }
        if (mother.mother) {
          const gp = people.find(p => p.id === mother.mother);
          if (gp) relatives.grandparents.push(gp.fullname);
        }
      }
    }
    return relatives;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("closePersonModalBtn").addEventListener("click", closeInfoModal);
  });
  