document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username && password) {
                alert('Login successful! Redirecting...');
                window.location.href = 'index.html'; // Replace with your main page URL
            } else {
                alert('Please enter both username and password.');
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('newUsername').value;
            const password = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password === confirmPassword) {
                alert('Registration successful! You can now log in.');
                window.location.href = 'login.html'; // Redirect to the login page
            } else {
                alert('Passwords do not match.');
            }
        });
    }

    // Handle offer ride form submission
    const offerForm = document.getElementById('offerForm');
    if (offerForm) {
        offerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const startCheckpoint = document.getElementById('startCheckpoint').value;
            const endCheckpoint = document.getElementById('endCheckpoint').value;
            const rideTime = document.getElementById('rideTime').value;
            const seatsAvailable = document.getElementById('seatsAvailable').value;

            fetch('http://localhost:3000/api/offer-ride', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startCheckpoint,
                    endCheckpoint,
                    rideTime,
                    seatsAvailable
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                offerForm.reset();
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle search ride form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchCheckpoint = document.getElementById('searchCheckpoint').value;

            fetch('http://localhost:3000/api/search-ride', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchCheckpoint
                })
            })
            .then(response => response.json())
            .then(data => {
                const rideResults = document.getElementById('rideResults');
                rideResults.innerHTML = data.rides.map(ride =>
                    `<p>Ride from ${ride.startCheckpoint} to ${ride.endCheckpoint} at ${ride.rideTime} with ${ride.seatsAvailable} seats available.</p>`
                ).join('');
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle chat functionality
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const chatInput = document.getElementById('chatInput').value;
            const chatMessages = document.getElementById('chatMessages');

            if (chatInput) {
                const newMessage = document.createElement('p');
                newMessage.textContent = chatInput;
                chatMessages.appendChild(newMessage);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }
});
