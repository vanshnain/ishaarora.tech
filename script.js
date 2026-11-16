document.addEventListener("DOMContentLoaded", () => {
  // Load saved data from browser localStorage
  let totalBudget = Number(localStorage.getItem("totalBudget")) || 0;
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let goals = JSON.parse(localStorage.getItem("goals")) || [];

  const page = window.location.pathname.toLowerCase();

  // ==========================================
  // 1. DASHBOARD PAGE (dashboard.html)
  // ==========================================
  if (page.includes("dashboard")) {
    const forms = document.querySelectorAll("form");
    const summaryCells = document.querySelectorAll('table[border="1"] tbody td');

    function updateDashboard() {
      const totalExp = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
      const remaining = totalBudget - totalExp;

      if (summaryCells.length >= 3) {
        summaryCells[0].innerText = `₹ ${totalBudget}`;
        summaryCells[1].innerText = `₹ ${totalExp}`;
        summaryCells[2].innerText = `₹ ${remaining}`;
      }
    }

    updateDashboard();

    // Form 1: Save Total Budget
    if (forms[0]) {
      forms[0].addEventListener("submit", (e) => {
        e.preventDefault();
        const budgetInput = forms[0].querySelector('input[type="number"]');
        if (budgetInput) {
          totalBudget = Number(budgetInput.value);
          localStorage.setItem("totalBudget", totalBudget);
          updateDashboard();
          budgetInput.value = "";
        }
      });
    }

    // Form 2: Quick Add Expense
    if (forms[1]) {
      forms[1].addEventListener("submit", (e) => {
        e.preventDefault();
        const title = forms[1].querySelector('input[type="text"]').value;
        const amount = Number(forms[1].querySelector('input[type="number"]').value);
        const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

        expenses.push({
          date: today,
          title: title,
          category: "General",
          payment: "UPI",
          amount: amount
        });

        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateDashboard();
        forms[1].reset();
      });
    }
  }

  // ==========================================
  // 2. ADD EXPENSE PAGE (add-expense.html)
  // ==========================================
  if (page.includes("add-expense")) {
    const form = document.querySelector("form");
    const tbody = document.querySelector('table[border="1"] tbody');

    function renderExpenses() {
      if (!tbody || expenses.length === 0) return;
      tbody.innerHTML = "";
      expenses.forEach((exp) => {
        tbody.innerHTML += `
          <tr>
            <td>${exp.date}</td>
            <td>${exp.title}</td>
            <td>${exp.category}</td>
            <td>${exp.payment}</td>
            <td>₹ ${exp.amount}</td>
          </tr>
        `;
      });
    }

    renderExpenses();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = form.querySelector('input[type="text"]').value;
        const amount = Number(form.querySelector('input[type="number"]').value);
        const selects = form.querySelectorAll("select");
        const category = selects[0] ? selects[0].options[selects[0].selectedIndex].text : "Other";
        const payment = selects[1] ? selects[1].options[selects[1].selectedIndex].text : "Cash";
        const dateVal = form.querySelector('input[type="date"]').value;
        const formattedDate = dateVal ? dateVal.split("-").reverse().join("-") : new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

        expenses.push({ date: formattedDate, title, category, payment, amount });
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
        form.reset();
      });
    }
  }

  // ==========================================
  // 3. SAVINGS GOALS PAGE (saving-goals.html)
  // ==========================================
  if (page.includes("saving-goals")) {
    const form = document.querySelector("form");
    const tbody = document.querySelector('table[border="1"] tbody');

    function renderGoals() {
      if (!tbody || goals.length === 0) return;
      tbody.innerHTML = "";
      goals.forEach((g) => {
        const percent = Math.min(100, Math.round((g.saved / g.target) * 100));
        const filledBlocks = Math.round(percent / 10);
        const bar = "█".repeat(filledBlocks) + "░".repeat(10 - filledBlocks);

        tbody.innerHTML += `
          <tr>
            <td>${g.name}</td>
            <td>₹ ${g.target}</td>
            <td>₹ ${g.saved}</td>
            <td>${bar} ${percent}%</td>
            <td>${g.deadline}</td>
          </tr>
        `;
      });
    }

    renderGoals();

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.querySelector('input[type="text"]').value;
        const nums = form.querySelectorAll('input[type="number"]');
        const target = Number(nums[0].value);
        const saved = Number(nums[1].value);
        const dateVal = form.querySelector('input[type="date"]').value;
        const deadline = dateVal ? dateVal.split("-").reverse().join("-") : "No Deadline";

        goals.push({ name, target, saved, deadline });
        localStorage.setItem("goals", JSON.stringify(goals));
        renderGoals();
        form.reset();
      });
    }
  }

  // ==========================================
  // 4. BUDGET ANALYSIS PAGE (budget-analysis.html)
  // ==========================================
  if (page.includes("budget-analysis")) {
    const tbody = document.querySelector('table[border="1"] tbody');
    const summaryList = document.querySelector("ul");

    if (expenses.length > 0 && tbody) {
      const categoryTotals = {};
      let grandTotal = 0;

      expenses.forEach((exp) => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
        grandTotal += Number(exp.amount);
      });

      tbody.innerHTML = "";
      let maxCat = { name: "-", amount: 0 };
      let minCat = { name: "-", amount: Infinity };

      for (const [cat, amt] of Object.entries(categoryTotals)) {
        const blocks = Math.max(1, Math.round((amt / grandTotal) * 25));
        const bar = "█".repeat(blocks);

        tbody.innerHTML += `
          <tr>
            <td>${cat}</td>
            <td>₹ ${amt}</td>
            <td>${bar}</td>
          </tr>
        `;

        if (amt > maxCat.amount) maxCat = { name: cat, amount: amt };
        if (amt < minCat.amount) minCat = { name: cat, amount: amt };
      }

      if (summaryList) {
        summaryList.innerHTML = `
          <li><b>Total Spending:</b> ₹ ${grandTotal}</li>
          <li><b>Most Expensive Category:</b> ${maxCat.name} (₹ ${maxCat.amount})</li>
          <li><b>Least Expensive Category:</b> ${minCat.name} (₹ ${minCat.amount})</li>
        `;
      }
    }
  }

  // ==========================================
  // 5. AFFORDABILITY CALCULATOR (check-affordability.html)
  // ==========================================
  if (page.includes("check-affordability")) {
    const form = document.querySelector("form");
    const resultList = document.querySelector("ul");

    if (form && resultList) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = form.querySelector('input[type="text"]').value;
        const nums = form.querySelectorAll('input[type="number"]');
        const cost = Number(nums[0].value);
        const monthlySavings = Number(nums[1].value);
        const monthlyBills = Number(nums[2].value);

        const disposable = monthlySavings - monthlyBills;
        let status = "";
        let analysis = "";

        if (disposable <= 0) {
          status = "❌ Not Recommended Right Now";
          analysis = "Your monthly bills exceed or equal your monthly savings. Focus on reducing fixed costs first.";
        } else if (cost <= disposable) {
          status = "✅ Yes, You Can Afford It!";
          analysis = `It fits comfortably within your extra monthly savings (₹ ${disposable}) without affecting your bills.`;
        } else {
          const monthsNeeded = Math.ceil(cost / disposable);
          status = "⏳ Save Before Buying";
          analysis = `You need to save for <b>${monthsNeeded} more month(s)</b> (at ₹ ${disposable}/month after bills) to afford this safely.`;
        }

        resultList.innerHTML = `
          <li>
            <b>Item: ${itemName} (₹ ${cost})</b><br>
            Status: ${status}<br>
            Analysis: ${analysis}
          </li>
        `;
      });
    }
  }
});
