let apiBaseUrl = 'https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees';

// Constants for pagination variables and code
let itemsPerPage = 10; 
let currentPage = 1; 
let totalPages = 1;


async function fetchEmployeeData() {
    try {
        // Build the  parameters for the API request
  let sex = document.getElementById('genderFilter').value;
        let sortSalary= document.getElementById('salarySort').value;
        let department = document.getElementById('departmentFilter').value;
        
        let queryParams = `page=${currentPage}&limit=${itemsPerPage}`;

        // Add filter by department if specific
           if (department) {
            queryParams += `&filterBy=department&filterValue=${department}`;
        }

        // Add filter by gender if specified
        if (sex) {
            queryParams += `&filterBy=gender&filterValue=${sex}`;
        }

        // Add sorting by salary if specified
        if (sortSalary) {
            queryParams += `&sort=salary&order=${sortSalary}`;
        }

        // Fetch data from the API
        const response = await fetch(`${apiBaseUrl}?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee data');
        }

        // Get the data from the response
        let data = await response.json();
        
        // Determine total number of pages based on the fetched data and items per page
        totalPages = Math.ceil(data.count / itemsPerPage);

        // Display the fetched data in the table
        displayEmployees(data.data);
        
        // Update the state of pagination buttons
        updatePaginationControls();

    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
}

// Function to display employeees in table form
function displayEmployees(employees) {
    let employeeTable = document.getElementById('employeeTable');
    employeeTable.innerHTML = ''; 

    employees.forEach((emp, index) => {
        let row = `<tr>
                        <td>${(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>${emp.name}</td>
                        <td>${emp.gender}</td>
                        <td>${emp.department}</td>
                        <td>$${emp.salary.toLocaleString()}</td>
                    </tr>`;
        employeeTable.insertAdjacentHTML('beforeend', row);
    });
}

// Function to update pagination controls
function updatePaginationControls() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
// Disable "Previous" button if on the first page


    prevButton.disabled = currentPage <= 1;

    // Disable "Next" button if on the last page
    nextButton.disabled = currentPage >= totalPages;
}

// Event listeners for pagination
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--; // Go to the previous page
        fetchEmployeeData(); // Fetch data for the new page
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++; // Go to the next page
        fetchEmployeeData(); // Fetch data for the new page
    }
});

// Event list for filters and sorting
document.getElementById('departmentFilter').addEventListener('change', () => {
    currentPage = 1; // Reset to the first page then filtering data
    fetchEmployeeData(); // Fetch with updated filter
});

document.getElementById('genderFilter').addEventListener('change', () => {
    currentPage = 1; // Reset to the first page when filtering
    fetchEmployeeData(); // Fetch with updated filter
});

document.getElementById('salarySort').addEventListener('change', () => {
    currentPage = 1; // Reset to the first page when sorting
    fetchEmployeeData(); // Fetch with updated sorting
});

// Fetch data on page loading
fetchEmployeeData(); 