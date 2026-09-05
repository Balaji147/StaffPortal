import { useState } from "react"
import {useNavigate} from "react-router-dom"
import { api } from "../configs/axios.config"
export const Auth = ({authType})=>{
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const INIT_VALUES = {
        username:"",
        email:"",
        password:""
    }
    const [fieldValue, setFieldValues] = useState(INIT_VALUES)

    const onChangeHandler = (e)=>{
        const {name, value} = e.target

        setFieldValues((prev)=>({...prev, [name]:value}))
    }

    const onSubmitHandler = async(e)=>{
        e.preventDefault()
        
        let routeTo = "createAcct"
        if(authType === "signin")
            routeTo = authType

        const createAccount = await api.post(`http://localhost:5000/auth/${routeTo}`,  fieldValue)

        if(createAccount && createAccount.status === 200){
            navigate("/")
            return
        }
    }
    return(
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
                
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        {authType === "signup"?"Create an account":"Welcome back"}
                    </h1>
                </div>

                <form className="space-y-5" onSubmit={onSubmitHandler}>
                {authType === "signup" && 
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                        <div className="relative">
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            required
                            onChange={onChangeHandler}
                            value={fieldValue.username}
                            placeholder="johndoe"
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                        </div>
                    </div>
                }

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                    <div className="relative">
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        onChange={onChangeHandler}
                        value={fieldValue.email}
                        placeholder="you@company.com"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                    <input 
                        type={!showPassword?"password":"text"} 
                        id="password" 
                        name="password" 
                        required
                        onChange={onChangeHandler}
                        value={fieldValue.password}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    <button 
                        type="button" 
                        aria-label="Toggle password visibility" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        onClick={()=>setShowPassword(!showPassword)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    </div>
                    {authType === "signup" && 
                        <p className="mt-2 text-xs text-slate-500">
                        Must contain at least 8 characters.
                        </p>
                    }
                </div>

                <button 
                    type="submit" 
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                    {authType === "signup"?"Create account":"Login My Account"}
                </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600">
                    {authType === "signup"?"Already have an account? ":"Don't have an account? "}
                    <a href={authType === "signup"?"/signin":"/signup"} className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                        {authType === "signup"?"Sign in":"Sign up"}
                    </a>
                </div>

            </div>
        </div>
    )
}