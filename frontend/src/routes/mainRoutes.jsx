import {Route, Routes} from "react-router-dom"
import Navbar from "../pages/navbar.page.jsx"
import SignUp from "../pages/signup.page.jsx"
import SignIn from "../pages/signin.page.jsx"
import Dashboard from "../pages/dashboard.page.jsx"
import EmployeeList from "../pages/employeesList.page.jsx"

const HomeRoutes = ()=>{
    return(
        <Routes>
            <Route element={<Navbar/>}>
                <Route path="/" element={<Dashboard/>}/>
                <Route path="/employees" element={<EmployeeList/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/signin" element={<SignIn/>}/>
            </Route>
        </Routes>
    )
}

export default HomeRoutes