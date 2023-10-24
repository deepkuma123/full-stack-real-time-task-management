document
        .getElementById("signup-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const firstname = document.getElementById("firstname").value;
          const lastname = document.getElementById("lastname").value;
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          const type = document.getElementById("type").value; // Updated 'role' to 'type'

          axios
            .post("/api/signup", { firstname, lastname, email, password, type }) // Updated 'role' to 'type'
            .then(function (response) {
              console.log("User registered successfully");
              // You can add a redirect or other actions here
              window.location.href = 'login.html';

            })
            .catch(function (error) {
              console.error("Registration error:", error);
              // Handle registration error (e.g., display an error message)
            });
        });