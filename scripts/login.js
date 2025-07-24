// scripts/login.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if(localStorage.getItem('loggedInUser')) {
        window.location.href = 'index.html';
    }

    // Add event listener to login form
    document.querySelector('.login-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
});

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if(!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username);

    if(user && user.password === password) {
        localStorage.setItem("loggedInUser", user.username);
        window.location.href = "index.html";
    } else {
        alert("Invalid username or password");
    }
}