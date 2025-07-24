document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if(!localStorage.getItem('loggedInUser')) {
        alert('Please log in to add expenses');
        window.location.href = 'login.html';
        return;
    }

    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();

    // Form submission handler
    document.getElementById('expense-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addExpense();
    });
});

function addExpense() {
    const expense = document.getElementById("expense").value.trim();
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    // Validation
    if(!expense || !category || isNaN(amount) || !date || !time) {
        alert("Please fill all fields correctly");
        return;
    }

    if(amount <= 0) {
        alert("Amount must be positive");
        return;
    }

    const loggedInUser = localStorage.getItem("loggedInUser");
    let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
    
    if(!expenses[loggedInUser]) {
        expenses[loggedInUser] = [];
    }

    expenses[loggedInUser].push({
        expense,
        category,
        amount,
        date,
        time
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));
    
    // Show success modal
    showSuccessModal();
}

function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <i class="fas fa-check-circle"></i>
            <h3>Expense Added Successfully!</h3>
            <p>Redirecting to view expenses...</p>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
        window.location.href = 'view-expense.html';
    }, 2000);
}