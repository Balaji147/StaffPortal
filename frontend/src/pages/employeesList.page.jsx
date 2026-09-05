import { Header } from "../components/header.component.jsx";
import { api } from "../configs/axios.config.js";
import employee_icon from "../icons/employee_icon.svg";
import EmployeeModal from "../components/employee.modal.component.jsx";
import StatusConfirmModal from "../components/confirmation.modal.component.jsx";
import { useEffect, useState, useMemo } from "react";

const backendUrl = import.meta.env.VITE_API_URL;

const EmployeeList = () => {
  const [employeesList, setEmployeesList] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Records per page

  const getEmployeesListFn = async () => {
    try {
      const response = await api.get(`${backendUrl}employee/getAllEmployees`);
      setEmployeesList(response?.data?.allEmployees || []);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  useEffect(() => {
    getEmployeesListFn();
  }, []);

  const editEmployeeHandler = (employee) => {
    setEditEmployee(employee);
  };

  const onActiveHandler = (emplData) => {
    setActiveEmployee(emplData);
  };

  // Filtered dataset based on name search
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employeesList;
    const lowerQuery = searchQuery.toLowerCase().trim();

    return employeesList.filter((emp) => {
      const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
      const directFullName = (emp.fullName || "").toLowerCase();
      return fullName.includes(lowerQuery) || directFullName.includes(lowerQuery);
    });
  }, [employeesList, searchQuery]);

  // Pagination calculation
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Derived indices for count text
  const startResult = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalItems);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search input
  };

  return (
    <div>
      <Header icon={employee_icon} title="Employee List" />

      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Table Header Section: Search & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          
          {/* Search Field */}
          <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              onClick={() => {
                setEditEmployee(null);
                setIsModalOpen(true);
              }}
            >
              Add Employee
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700">
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700">
                    Designation
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((employee) => (
                    <tr className="hover:bg-slate-50/80 transition-colors" key={employee._id}>
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                        {employee.employeeId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                        {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {employee.designation}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {employee.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            onClick={() => editEmployeeHandler(employee)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={`rounded-md border ${
                              employee.isActive
                                ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                            } px-2.5 py-1.5 text-xs font-medium transition-colors`}
                            onClick={() =>
                              onActiveHandler({
                                id: employee._id,
                                fullName: employee.fullName || `${employee.firstName} ${employee.lastName}`,
                                isActive: employee.isActive,
                              })
                            }
                          >
                            {employee.isActive ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                      {searchQuery ? "No employees match your search criteria." : "No employees found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Dynamic Footer / Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
            <span>
              Showing {startResult} to {endResult} of {totalItems} results
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1 || totalItems === 0}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="rounded border border-slate-200 bg-white px-2.5 py-1 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || totalItems === 0}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="rounded border border-slate-200 bg-white px-2.5 py-1 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {(isModalOpen || editEmployee) && (
        <EmployeeModal
          setIsModalOpen={setIsModalOpen}
          editEmployee={editEmployee}
          setEditEmployee={setEditEmployee}
          isModalOpen={isModalOpen}
          getEmployeesListFn={getEmployeesListFn}
        />
      )}

      {activeEmployee && (
        <StatusConfirmModal
          setActiveEmployee={setActiveEmployee}
          activeEmployee={activeEmployee}
          getEmployeesListFn={getEmployeesListFn}
        />
      )}
    </div>
  );
};

export default EmployeeList;