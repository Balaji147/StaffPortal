import { useState, useEffect } from "react";
import { api } from "../configs/axios.config";

const backendUrl = import.meta.env.VITE_API_URL;

const INITIAL_VALUES = {
  employeeId: "",
  joiningDate: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  designation: "",
};

const EmployeeModal = ({
  setIsModalOpen,
  setEditEmployee,
  editEmployee,
  getEmployeesListFn,
}) => {
  const [fieldValue, setFieldValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(editEmployee && (editEmployee._id || editEmployee.id));

  // Sync state when editEmployee changes
  useEffect(() => {
    if (isEditMode) {
      setFieldValues({
        employeeId: editEmployee.employeeId || "",
        joiningDate: editEmployee.joiningDate
          ? new Date(editEmployee.joiningDate).toISOString().split("T")[0]
          : "",
        firstName: editEmployee.firstName || "",
        lastName: editEmployee.lastName || "",
        email: editEmployee.email || "",
        phone: editEmployee.phone || "",
        designation: editEmployee.designation || "",
      });
    } else {
      setFieldValues(INITIAL_VALUES);
    }
    setErrors({});
    setServerError("");
  }, [editEmployee, isEditMode]);

  // Client-side field validation rules
  const validate = (values) => {
    const errs = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!values.employeeId.trim()) {
      errs.employeeId = "Employee ID is required";
    }

    if (!values.firstName.trim()) {
      errs.firstName = "First name is required";
    }

    if (!values.lastName.trim()) {
      errs.lastName = "Last name is required";
    }

    if (!values.email.trim()) {
      errs.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!values.designation.trim()) {
      errs.designation = "Designation is required";
    }

    return errs;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFieldValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const clientErrors = validate(fieldValue);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      let response;
      const targetId = editEmployee?._id || editEmployee?.id;

      if (isEditMode) {
        // UPDATE Existing Employee
        response = await api.put(
          `${backendUrl}employee/updateEmployee/${targetId}`,
          fieldValue
        );
      } else {
        // CREATE New Employee
        response = await api.post(
          `${backendUrl}employee/createEmployee`,
          fieldValue
        );
      }

      if (response.status === 200 || response.status === 201) {
        // if (onEmployeeCreated) onEmployeeCreated(response.data);
        getEmployeesListFn();
        setEditEmployee(null)
        setIsModalOpen(false);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
      errors[fieldName]
        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
        : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            {isEditMode ? "Edit Employee" : "Add New Employee"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {isEditMode
              ? "Modify the employee details below."
              : "Enter the details below to register a new employee record."}
          </p>
        </div>

        {/* Global Server Error Banner */}
        {serverError && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmitHandler} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                placeholder="EMP-1021"
                name="employeeId"
                value={fieldValue.employeeId}
                onChange={onChangeHandler}
                className={getInputClass("employeeId")}
              />
              {errors.employeeId && (
                <p className="mt-1 text-xs text-rose-600">{errors.employeeId}</p>
              )}
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={fieldValue.joiningDate}
                onChange={onChangeHandler}
                className={getInputClass("joiningDate")}
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                placeholder="Marcus"
                name="firstName"
                value={fieldValue.firstName}
                onChange={onChangeHandler}
                className={getInputClass("firstName")}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                placeholder="Vance"
                name="lastName"
                value={fieldValue.lastName}
                onChange={onChangeHandler}
                className={getInputClass("lastName")}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Work Email *
              </label>
              <input
                type="email"
                placeholder="marcus.vance@company.com"
                name="email"
                value={fieldValue.email}
                onChange={onChangeHandler}
                className={getInputClass("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1-555-0101"
                name="phone"
                value={fieldValue.phone}
                onChange={onChangeHandler}
                className={getInputClass("phone")}
              />
            </div>

            {/* Designation */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                placeholder="Software Engineer"
                name="designation"
                value={fieldValue.designation}
                onChange={onChangeHandler}
                className={getInputClass("designation")}
              />
              {errors.designation && (
                <p className="mt-1 text-xs text-rose-600">{errors.designation}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 transition-opacity"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Employee"
                : "Save Employee"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EmployeeModal;