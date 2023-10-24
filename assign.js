


const assignTaskForm = document.getElementById('assign-task-form');
        const userSelect = document.getElementById('user');
        const taskInput = document.getElementById('task');
        const descriptionTextarea = document.getElementById('description');
        const statusSelect = document.getElementById('status');
        const taskList = document.getElementById('task-list');



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
        alert("your session is expired please login again");
      // Token is expired or missing, redirect to login.html
      window.location.href = 'login.html';
    } else {
      // Token is still valid, you can continue with your application logic
      console.log('Token is still valid');
    }
  }
  // Check if the token is expired or missing

  const tokenCheckInterval = setInterval(reloadServerIfTokenExpired, 1 * 60 * 1); // 5 minutes in milliseconds


        assignTaskForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const userId = userSelect.value;
            const task = taskInput.value;
            const description = descriptionTextarea.value;
            const status = statusSelect.selectedOptions[0].textContent;
            const token = localStorage.getItem('token');

            axios.post('/api/assign-task', { userId, task, description, status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(function (response) {
                console.log('Task assigned successfully');
                // You may want to update the UI to indicate success
            })
            .catch(function (error) {
                console.error('Error assigning task:', error);
                // Handle error and provide feedback to the admin
            });
        });

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

        // Function to update the task list
        function updateTaskList() {
            const token = localStorage.getItem('token');
            if (!token) {
                // No token found in localStorage, redirect the user to the login page
                window.location.href = '/login.html'; // Replace with your login page URL
                return;
            }
        

            axios.get('/api/all-tasks', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                taskList.innerHTML = ''; // Clear existing tasks
                response.data.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="task">${task.task}</td>
                        <td data-label="Description">${task.description}</td>
                        <td data-label="Status">${task.status}</td>
                        <td data-label="Assign name">${task.firstname} ${task.lastname}</td>
                        <td data-label="Action">
                        <div class=flex>    
                        <button class="button button-block" onclick="editTask(${task.id}, ${task.user_id}, '${task.task}', '${task.description}', '${task.status}')">Edit</button>
                            <button class="button button-block" onclick="deleteTask(${task.id})">Delete</button>
                            <div>
                            </td>
                    `;
                    taskList.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
        }

        function editTask(taskId, userId, task, description, status) {
            userSelect.value = userId;
            taskInput.value = task;
            descriptionTextarea.value = description;
            
            for (let i = 0; i < statusSelect.options.length; i++) {
                if (statusSelect.options[i].text === status) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }
            
            console.log(userId)
            const submitButton = assignTaskForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Update Task';
            submitButton.onclick = function (e) {
                e.preventDefault();
                const updatedUserId = userSelect.value;
                const updatedTask = taskInput.value;
                const updatedDescription = descriptionTextarea.value;
                const updatedStatus = statusSelect.options[statusSelect.selectedIndex].textContent; // Get text content
                const token =localStorage.getItem('token')

                
                axios.put(`/api/edit-task/${taskId}`, { userId:updatedUserId,task: updatedTask, description: updatedDescription, status: updatedStatus }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                
                    }
                })
             
                
                .then(function (response) {
                    console.log('Task updated successfully');
                    resetTaskForm();
                    updateTaskList();
                })
                .catch(function (error) {
                    console.error('Error updating task:', error);
                });
            };
        }

        function deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                const token = localStorage.getItem('token');
        
                axios.delete(`/api/delete-task/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(function (response) {
                    console.log('Task deleted successfully');
                    updateTaskList(); // Refresh the task list after deletion
                })
                .catch(function (error) {
                    console.error('Error deleting task:', error);
                });
            }
        }
        

        function resetTaskForm() {
            assignTaskForm.reset();
            const submitButton = assignTaskForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Assign Task';
        }

        // Call the functions to populate users and statuses when the page loads
        populateUserDropdown();
        populateStatusInput();
        updateTaskList();