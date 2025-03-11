// search.js

document.addEventListener("DOMContentLoaded", function() {
    const suggestions = document.getElementById("searchSuggestions");
    suggestions.innerHTML = "";
    people.forEach(person => {
      const duplicates = people.filter(p => p.fullname.toUpperCase() === person.fullname.toUpperCase());
      let extraInfo = "";
      if (duplicates.length > 1) {
        if (person.spouse) {
          const spouse = people.find(p => p.id === person.spouse);
          if (spouse) extraInfo = "Spouse: " + spouse.fullname;
        }
        if (!extraInfo && person.father) {
          const father = people.find(p => p.id === person.father);
          if (father) extraInfo = "Father: " + father.fullname;
        }
        if (!extraInfo && person.mother) {
          const mother = people.find(p => p.id === person.mother);
          if (mother) extraInfo = "Mother: " + mother.fullname;
        }
        if (!extraInfo) {
          extraInfo = "ID: " + person.id;
        }
      }
      let optionText = person.fullname;
      if (extraInfo) {
        optionText += " - (" + extraInfo + ")";
      }
      const option = document.createElement("option");
      option.value = optionText;
      suggestions.appendChild(option);
    });
  
    document.getElementById("searchBtn").addEventListener("click", function() {
      let inputVal = document.getElementById("searchInput").value.trim().toUpperCase();
      if (!inputVal) return;
      let query = inputVal;
      let extraPart = "";
      if (inputVal.includes(" - ")) {
        const parts = inputVal.split(" - ");
        query = parts[0].trim();
        extraPart = parts[1].replace("(", "").replace(")", "").trim();
      }
      const candidates = people.filter(p => p.fullname.toUpperCase() === query);
      let selectedPerson = null;
      if (candidates.length === 1) {
        selectedPerson = candidates[0];
      } else if (candidates.length > 1) {
        for (let person of candidates) {
          let candidateExtra = "";
          if (person.spouse) {
            const spouse = people.find(p => p.id === person.spouse);
            if (spouse) candidateExtra = "Spouse: " + spouse.fullname.toUpperCase();
          }
          if (!candidateExtra && person.father) {
            const father = people.find(p => p.id === person.father);
            if (father) candidateExtra = "Father: " + father.fullname.toUpperCase();
          }
          if (!candidateExtra && person.mother) {
            const mother = people.find(p => p.id === person.mother);
            if (mother) candidateExtra = "Mother: " + mother.fullname.toUpperCase();
          }
          if (!candidateExtra) {
            candidateExtra = "ID: " + person.id.toUpperCase();
          }
          if (candidateExtra === extraPart) {
            selectedPerson = person;
            break;
          }
        }
        if (!selectedPerson) {
          selectedPerson = candidates[0];
        }
      }
      if (selectedPerson) {
        if (network) {
          network.selectNodes([selectedPerson.id]);
          network.focus(selectedPerson.id, { scale: 1.5 });
        }
      } else {
        alert("No matching person found.");
      }
    });
  });
  