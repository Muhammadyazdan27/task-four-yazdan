const API_URL = 'http://localhost:3000/users';

// 1. Database se users mangwana (READ)
async function loadUsers() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        const container = document.getElementById('usersContainer');
        container.innerHTML = ''; 

        if (result.data && result.data.length > 0) {
            result.data.forEach(user => {
                const card = document.createElement('article');
                card.className = 'tool-card';
                card.innerHTML = `
                    <h3>${user.name}</h3>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <p><small>Database ID: ${user.id}</small></p>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<p>No users found in the database.</p>';
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// 2. Naya user form se database mein bhejna (CREATE)
const userForm = document.getElementById('userForm');
const statusMessage = document.getElementById('statusMessage');

userForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const nameValue = document.getElementById('nameInput').value;
    const roleValue = document.getElementById('roleInput').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nameValue, role: roleValue })
        });

        const result = await response.json();

        if (response.ok) {
            statusMessage.style.color = "green";
            statusMessage.textContent = "Success: " + result.message;
            userForm.reset(); 
            loadUsers(); // Naya data aane par UI update karein
        } else {
            statusMessage.style.color = "red";
            statusMessage.textContent = "Error: " + result.error;
        }
    } catch (error) {
        statusMessage.style.color = "red";
        statusMessage.textContent = "System Error: Backend is not responding.";
    }
});

// Jab page load ho tou data mangwa lo
window.addEventListener('DOMContentLoaded', loadUsers);