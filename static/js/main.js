// Wait for the DOM to fully load
// This prevents the script from failing to work or execute as expected

document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expenseForm");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");

  // 1. PERSIST SIDEBAR STATE
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed) {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("expanded");
  }

  // Toggle function for the button
  window.toggleSidebar = () => {
    const collapsed = sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");
    localStorage.setItem("sidebarCollapsed", collapsed);
  };

  // 2. ASYNCHRONOUS EXPENSE ADDITION
  if (expenseForm) {
    expenseForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        title: document.getElementById("title").value,
        amount: parseFloat(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
      };

      try {
        const response = await fetch("/add_expense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Hide the modal using Bootstrap's API
          const modal = bootstrap.Modal.getInstance(document.getElementById("expenseModal"));
          modal.hide();

          // Reset form
          expenseForm.reset();

          // TRICK: Reload only the table or update the numbers manually
          // For now, we'll refresh to ensure the DB syncs,
          // but we could use JS to append the row for a 'banking' feel.
          window.location.reload();
        }
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    });
  }
});
