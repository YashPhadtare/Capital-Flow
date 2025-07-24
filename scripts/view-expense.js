document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if(!loggedInUser) {
        alert('Please log in to view expenses');
        window.location.href = 'login.html';
        return;
    }

    // Load expenses
    loadExpenses();

    // Add event listener to search input
    document.getElementById('search').addEventListener('input', searchExpenses);

    // Add event listener to export button
    document.querySelector('.export-btn').addEventListener('click', exportExpenses);
});

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    const userExpenses = expenses[localStorage.getItem('loggedInUser')] || [];
    renderExpenses(userExpenses);
    updateTotalAmount(userExpenses);
}

function searchExpenses() {
    const query = document.getElementById('search').value.toLowerCase();
    const expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    const userExpenses = expenses[localStorage.getItem('loggedInUser')] || [];
    
    const filtered = userExpenses.filter(exp => 
        exp.expense.toLowerCase().includes(query) || 
        exp.category.toLowerCase().includes(query)
    );
    
    renderExpenses(filtered);
    updateTotalAmount(filtered);
}

function renderExpenses(expenses) {
    const tbody = document.querySelector('#expense-table tbody');
    tbody.innerHTML = '';

    if(expenses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-expenses">
                    <i class="fas fa-wallet"></i>
                    <p>No expenses found</p>
                </td>
            </tr>
        `;
        return;
    }

    expenses.forEach((exp, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exp.expense}</td>
            <td>${exp.category}</td>
            <td>₹${exp.amount.toFixed(2)}</td>
            <td>${formatDate(exp.date)}</td>
            <td>
                <button class="action-btn" onclick="deleteExpense(${index})" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTotalAmount(expenses) {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    document.getElementById('total-amount').textContent = `₹${total.toFixed(2)}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function exportExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    const userExpenses = expenses[localStorage.getItem('loggedInUser')] || [];
    
    if(userExpenses.length === 0) {
        alert('No expenses to export');
        return;
    }

    let csv = 'Expense,Category,Amount (₹),Date,Time\n';
    userExpenses.forEach(exp => {
        csv += `"${exp.expense}","${exp.category}",${exp.amount},"${formatDate(exp.date)}","${exp.time}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function deleteExpense(index) {
    if(confirm('Are you sure you want to delete this expense?')) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        let expenses = JSON.parse(localStorage.getItem('expenses')) || {};
        if(expenses[loggedInUser]) {
            expenses[loggedInUser].splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            loadExpenses();
        }
    }
}