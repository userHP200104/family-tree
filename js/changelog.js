// changelog.js

// Populate the change log modal with log entries
function populateChangeLog() {
    const container = document.getElementById("changeLogContent");
    container.innerHTML = "";
    if (changeLog.length === 0) {
      container.textContent = "No changes recorded.";
    } else {
      const ul = document.createElement("ul");
      changeLog.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = entry;
        ul.appendChild(li);
      });
      container.appendChild(ul);
    }
  }
  
  // Open the change log modal
  document.addEventListener("DOMContentLoaded", function() {
    const openBtn = document.getElementById("openChangeLogBtn");
    const closeBtn = document.getElementById("closeChangeLogBtn");
    const modal = document.getElementById("changeLogModal");
  
    openBtn.addEventListener("click", function() {
      populateChangeLog();
      modal.classList.remove("hidden");
    });
    closeBtn.addEventListener("click", function() {
      modal.classList.add("hidden");
    });
  });
  