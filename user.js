
const update = document.querySelector('#edit-task-form')
const userSelect = document.getElementById('user');
const taskInput = document.getElementById('task');
const descriptionTextarea = document.getElementById('description');
const statusSelect = document.getElementById('status');



const token = localStorage.getItem('token')

// Function to check if a token is expired
function isTokenExpired(token) {
    if (!token) {
      return true; // Token is missing, consider it expired
    }
    
    const [_, payload] = token.split('.'); // Split token and get payload
    const decodedPayload = JSON.parse(atob(payload)); // Decode the payload
    const expirationTime = decodedPayload.exp; // Get the expiration time
  
    if (expirationTime) {
      // Compare the expiration time with the current time
      const currentTime = Math.floor(Date.now() / 1000); // Convert to Unix timestamp
      return expirationTime < currentTime;
    }
    return true; // If expiration time is missing or invalid, consider it expired
  }
  
  function reloadServerIfTokenExpired() {
    if (isTokenExpired(token)) {
        if (!alert("Your session is expired. Please login again.")) {
            window.location.href = 'login.html';
        }
    } else {
      // Token is still valid, you can continue with your application logic
      console.log('Token is still valid');
    }
  }
  // Check if the token is expired or missing

  const tokenCheckInterval = setInterval(reloadServerIfTokenExpired, 1 * 60 * 1); // 5 minutes in milliseconds

 // Function to populate the user dropdown
 function populateUserDropdown() {
    const token = localStorage.getItem('token');
    axios.get('/api/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        userSelect.innerHTML = ''; // Clear existing options
        response.data.forEach(user => {
            const option = new Option(`${user.firstname} ${user.lastname}`, user.id);
            userSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

// Function to populate the status input field
function populateStatusInput() {
    const token = localStorage.getItem('token');
    axios.get('/api/statuses', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        statusSelect.innerHTML = ''; // Clear existing options
        response.data.forEach(status => {
            const option = new Option(status.status_name, status.status_id);
            statusSelect.add(option);
        });
    })
    .catch(error => {
        console.error('Error fetching statuses:', error);
    });
}


// Fetch and display all tasks 
function fetchTasks() {
    const token = localStorage.getItem('token');

    if (!token) {
        // No token found in localStorage, redirect the user to the login page
        window.location.href = '/login.html'; // Replace with your login page URL
        return;
    }

    fetch('/api/my-tasks', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        data.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="task"> ${task.task}</td>
                <td data-label="Description"> ${task.description}</td>
                <td data-label="Status"> ${task.status}</td>
                <td data-label="Assign name"> ${task.firstname} ${task.lastname}</td>
                <td data-label="Action">
                    <button class="button button-block" onclick="editTask(${task.id}, ${task.user_id}, '${task.task}', '${task.description}', '${task.status}')">Edit</button>
                </td>
            `;
            taskList.appendChild(row);
        });

    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
}

function editTask(taskId, userId, tasked,description,status) {
    console.log("Task ID:", taskId);
    console.log("User ID:", userId);
                // Check if the user has permission to edit this task
                const token = localStorage.getItem('token');

                axios.get(`/api/task/${taskId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
    .then(response => {
        const task = response.data;

        if (task.user_id === userId) {
            // Populate the edit form with task details
            userSelect.value = userId;
            taskInput.value = tasked;
            descriptionTextarea.value = description;
            
            for (let i = 0; i < statusSelect.options.length; i++) {
                if (statusSelect.options[i].text === status) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }

            userSelect.disabled = true;
            taskInput.disabled = true;
            descriptionTextarea.disabled = true;
            const submitButton = update.querySelector('button[type="submit"]');                    
            submitButton.onclick = function (e) {
                e.preventDefault();
                const updatedUserId = userSelect.value;
                const updatedTask = taskInput.value;
                const updatedDescription = descriptionTextarea.value;
                const updatedStatus = statusSelect.options[statusSelect.selectedIndex].textContent; // Get text content
                const token =localStorage.getItem('token')

                
                axios.put(`/api/edit-task-user/${taskId}`, { task: updatedTask, description: updatedDescription, status: updatedStatus }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                
                    }
                })
              
                .then(function (response) {
                    console.log('Task updated successfully');
                    fetchTasks();
                })
                .catch(function (error) {
                    console.error('Error updating task:', error);
                });
            };

        } else {
            alert('You do not have permission to edit this task.');
        }
    })
    .catch(error => {
        console.error('Error fetching task details:', error);
        alert('You do not have permission to edit this task.');
    });
}

// Call the fetchTasks function to initially populate the task list
fetchTasks();
populateStatusInput();
populateUserDropdown();
