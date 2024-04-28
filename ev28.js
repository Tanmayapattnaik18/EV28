document.addEventListener("DOMContentLoaded", function() {
    const baseURL = "https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees";
    let currentPage = 1;
    let currentFilterBy = "";
    let currentFilterValue = "";
    let currentSort = "";
    let currentOrder = "";

    const departmentFilter = document.getElementById("departmentFilter");
    const genderFilter = document.getElementById("genderFilter");
    const salarySort = document.getElementById("salarySort");
    const employeeTable = document.getElementById("employeeTable");
    const employeeBody = document.getElementById("employeeBody");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    departmentFilter.addEventListener("change", applyFilters);
    genderFilter.addEventListener("change", applyFilters);
    salarySort.addEventListener("change", applySort);
    prevBtn.addEventListener("click", goToPrevPage);
    nextBtn.addEventListener("click", goToNextPage);

    fetchData();

    function fetchData() {
        let url = `${baseURL}?page=${currentPage}&limit=10`;
        if (currentFilterBy && currentFilterValue) {
            url += `&filterBy=${currentFilterBy}&filterValue=${currentFilterValue}`;
        }
        if (currentSort && currentOrder) {
            url += `&sort=${currentSort}&order=${currentOrder}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                populateTable(data.data);
                updatePagination(data.totalPages);
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function populateTable(data) {
        employeeBody.innerHTML = "";
        data.forEach((employee, index) => {
            const row = `<tr>
                            <td>${index + 1}</td>
                            <td>${employee.name}</td>
                            <td>${employee.gender}</td>
                            <td>${employee.department}</td>
                            <td>${employee.salary}</td>
                        </tr>`;
            employeeBody.innerHTML += row;
        });
    }

    function updatePagination(totalPages) {
        if (currentPage === 1) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }

        if (currentPage === totalPages) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }

        pageInfo.textContent = `Page ${currentPage}`;
    }

    function applyFilters() {
        currentFilterBy = departmentFilter.value || genderFilter.value;
        currentFilterValue = currentFilterBy === "department" ? departmentFilter.value : genderFilter.value;
        currentPage = 1;
        fetchData();
    }

    function applySort() {
        currentSort = salarySort.value;
        currentOrder = currentSort ? salarySort.value : "";
        currentPage = 1;
        fetchData();
    }

    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            fetchData();
        }
    }

    function goToNextPage() {
        currentPage++;
        fetchData();
    }
});
