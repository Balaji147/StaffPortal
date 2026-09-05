import { useContext, useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { UserInfoContext } from "../contexts/user.context"
import { api } from "../configs/axios.config"
// import { useContext } from "react"

const backendUrl = import.meta.env.VITE_API_URL
const Navbar = ()=>{
    const navigate = useNavigate()
    const {setUserInfo, userInfo} = useContext(UserInfoContext)
    const toNavigateHandle = (enterInto)=>{
        navigate(`/${enterInto}`)
    }

    const signoutHandler = async()=>{
        const signoutStatus = await api.post(`${backendUrl}auth/signout`)
        console.log("fsd", signoutStatus.status)
        if(signoutStatus.status === 200){
            console.log("inside")
            return setUserInfo(null)
        }
    }

    useEffect(()=>{},[userInfo])

    console.log("user", userInfo)
    return(
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-8">
                    <a href="#" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
                        S
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                        StaffPortal
                        </span>
                    </a>

                    {/* Desktop Nav Links */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {/* Active Link State */}
                        <a
                        href="/"
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900"
                        >
                        Dashboard
                        </a>

                        {/* Inactive Link State */}
                        <a
                        href="/employees"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                        Employee List
                        </a>
                    </nav>
                    </div>

                    {!userInfo ? ( 
                            
                            <div className="hidden items-center gap-3 md:flex">
                            {/* Sign Out State */}
                            <button
                                type="button"
                                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                                onClick={()=>toNavigateHandle("signin")}
                            >
                                Sign in
                            </button>

                            {/* Sign In State */}
                            <button
                                type="button"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                onClick={()=>toNavigateHandle("signup")}
                            >
                                Sign up
                            </button>
                            </div>
                        ):
                        <div className="hidden items-center gap-3 md:flex">
                            <button
                                type="button"
                                className="rounded-lg border border-slate-200 bg-red-300 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                                onClick={signoutHandler}
                            >
                                Sign out
                            </button>
                        </div>
                    }

                    {/* Mobile Hamburger Toggle Button */}
                    <div className="flex md:hidden">
                    <button
                        type="button"
                        aria-label="Toggle Navigation"
                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    </div>
                </div>

                {/* Mobile Drawer (Remove 'hidden' or toggle via your own state) */}
                <div className="hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden">
                    <div className="space-y-1">
                        <a
                            href="#"
                            className="block rounded-lg bg-slate-100 px-3 py-2 text-base font-medium text-slate-900"
                        >
                            Dashboard
                        </a>
                        <a
                            href="#"
                            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                            Employee List
                        </a>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col gap-2">
                        <button
                            type="button"
                            className="w-full rounded-lg border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Sign out
                        </button>
                        <button
                            type="button"
                            className="w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </header>
            <Outlet/>
        </>
    )
}

export default Navbar