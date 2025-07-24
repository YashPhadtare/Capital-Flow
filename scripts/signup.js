// scripts/signup.js
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.signup-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        signup();
    });
});

function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validate inputs
    if(!name || !email || !username || !password) {
        alert("All fields are required!");
        return;
    }

    if(password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    if(users.some(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    if(users.some(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }

    const newUser = { name, email, username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Account created successfully!");
    window.location.href = "login.html";
}