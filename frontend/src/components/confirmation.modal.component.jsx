import { api } from "../configs/axios.config";
const backendUrl = import.meta.env.VITE_API_URL

const StatusConfirmModal = ({setActiveEmployee, activeEmployee, getEmployeesListFn})=>{

    const changeStatusHandler = async()=>{
        const changeStatus = await api.patch(`${backendUrl}employee/changeStatus/${activeEmployee.id}`, activeEmployee)

        if(changeStatus.status === 200){
            getEmployeesListFn()
            setActiveEmployee(null)
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl border border-slate-100 bg-white p-5 shadow-xl">
                
                {/* Header with Icon */}
                <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900 leading-tight">
                    Change Status
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Are you sure you want to change {activeEmployee.fullName}'s active status?
                    </p>
                </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3.5">
                <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    onClick={()=>setActiveEmployee(null)}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
                    onClick={changeStatusHandler}
                >
                    Confirm
                </button>
                </div>

            </div>
        </div>
    );
}

export default StatusConfirmModal