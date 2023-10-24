document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    axios.post('/api/login', { email, password })
        .then(function (response) {
            const token = response.data.token;
            const isAdmin = response.data.isAdmin;

            // Store the token securely (e.g., in a cookie or localStorage)
            localStorage.setItem('token', token);

            if (isAdmin) {
                // Redirect admin to adminassign.html
                window.location.href = 'adminassign.html';
            } else {
                // Handle redirection for regular users (if needed)
                window.location.href = 'userview.html'
            }
        })
        .catch(function (error) {
            // Handle login error (e.g., display an error message)
            console.error('Login error:', error);
        });
});

