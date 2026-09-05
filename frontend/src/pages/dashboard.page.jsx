import { useContext, useState } from "react"
import { UserInfoContext } from "../contexts/user.context"
import dashboard_icon from "../icons/dashboard_icon.svg"
import { Header } from "../components/header.component"
import axios from "axios"
import { useEffect } from "react"
import { api } from "../configs/axios.config"
const backendUrl = import.meta.env.VITE_API_URL
const Dashboard = ()=>{

    const {setUserInfo} = useContext(UserInfoContext)
    const [userStatus, setUserStatus] = useState({totalEmployee:0, activeEmployee:0, isActiveEmployee:0})
    const getUsersDetailsFn = async()=>{
        const getUsersDetails = await api.get(`${backendUrl}employee/getEmployeeByStatus`)
        setUserStatus(getUsersDetails.data.data)
    }
    useEffect(()=>{
        const getCurrentUserFn = async ()=>{
            const getCurrentUser = await axios.get(`${backendUrl}auth/getUser`, {withCredentials:true})
            const currentUser = getCurrentUser?.data?.user_data

            setUserInfo(currentUser)
        }

        getCurrentUserFn()
        getUsersDetailsFn()
    },[])
    
    return(
        <div>
            <Header icon={dashboard_icon} title="Dashboard"/>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      
                {/* Total Employees */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Employees
                        </p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                            {userStatus.total}
                        </h3>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                    <span>All registered company staff</span>
                    </div>
                </div>

                {/* Active Employees */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Active Employees
                        </p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-emerald-600">
                        {userStatus.active}
                        </h3>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Currently working & access enabled</span>
                    </div>
                </div>

                {/* Inactive Employees */}
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Inactive Employees
                        </p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-amber-600">
                        {userStatus?.inactive}
                        </h3>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>Suspended, on leave, or offboarded</span>
                    </div>
                </div>

                </div>
        </div>
    )
}

export default Dashboard