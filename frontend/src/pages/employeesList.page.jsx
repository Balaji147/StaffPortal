import {Header} from "../components/header.component.jsx"
import { api } from "../configs/axios.config.js"
import employee_icon from "../icons/employee_icon.svg"
import EmployeeModal from "../components/employee.modal.component.jsx"
const backendUrl = import.meta.env.VITE_API_URL
import {useEffect, useState} from "react"
import StatusConfirmModal from "../components/confirmation.modal.component.jsx"
const EmployeeList = ()=>{
    const [employeesList, setEmployeesList] = useState()
    const [editEmployee, setEditEmployee] = useState(null)
    const [activeEmployee, setActiveEmployee] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const getEmployeesListFn = async()=>{
        const getEmployeesList = await api.get(`${backendUrl}employee/getAllEmployees`)
        // console.log(getEmployeesList?.data?.allEmployees)
        setEmployeesList(getEmployeesList?.data?.allEmployees)
    }

    const editEmployeeHandler = (employee)=>{
        setEditEmployee(employee)
    }
    const onActiveHandler = (emplData)=>{
        setActiveEmployee(emplData)
    }
    useEffect(()=>{
        getEmployeesListFn()
    }, [])

    return(
        <div>
            <Header icon={employee_icon} title="Employee List"/>
            {employeesList ? 
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      
                {/* Table Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                        <p className="mt-1 text-sm text-slate-500">
                            A comprehensive list of company personnel including their role and contact details.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            onClick={()=>{setIsModalOpen(true)}}
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
                                {employeesList.map((employee)=>(
                                    <tr className="hover:bg-slate-50/80 transition-colors" key={employee._id}>
                                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                                        {employee.employeeId}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                        {employee.fullName}
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
                                                onClick={()=>editEmployeeHandler(employee)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                type="button"
                                                className={`rounded-md border ${employee.isActive?"bg-green-50 border-green-200 text-green-700":"bg-rose-50 border-rose-200 text-rose-700"} px-2.5 py-1.5 text-xs font-medium hover:bg-rose-100`}
                                                onClick={()=>onActiveHandler({id:employee._id, fullName:employee.fullName, isActive:employee.isActive})}
                                                >
                                                    {employee.isActive?"Active":"In Active"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination Scaffolding */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
                        <span>Showing 1 to 3 of 20 results</span>
                        <div className="flex gap-1">
                            <button
                            type="button"
                            className="rounded border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                            >
                            Previous
                            </button>
                            <button
                            type="button"
                            className="rounded border border-slate-200 bg-white px-2 py-1 hover:bg-slate-100"
                            >
                            Next
                            </button>
                        </div>
                    </div>
                </div>

                </div>
                :
                <div>
                    Empty
                </div>
            }  
            {(isModalOpen || editEmployee) && 
                <EmployeeModal
                    setIsModalOpen={setIsModalOpen}
                    editEmployee={editEmployee}
                    setEditEmployee={setEditEmployee}
                    isModalOpen={isModalOpen} 
                    getEmployeesListFn={getEmployeesListFn}/>}
            {activeEmployee && 
                <StatusConfirmModal setActiveEmployee={setActiveEmployee} activeEmployee={activeEmployee} getEmployeesListFn={getEmployeesListFn}/>}
        </div>
    )
}

export default EmployeeList