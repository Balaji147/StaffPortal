const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./server.js');
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cors = require("cors");
const User = require('./models/auth.model.js');
const { auth } = require('./middlewares/authValidate.middleware.js');
const Employee = require('./models/employees.model.js');

// Load environment variables
dotenv.config();
const jwt_key = process.env.JWT_SECRET_KEY

// Connect to Database
connectDB();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
// Body parser middleware
app.use(cookieParser())
app.use(express.json());

app.post('/auth/createAcct', async(req, res) => {
  try{
    const {username, email, password} = req.body
    const hashedPwd = await bcrypt.hash(password, 10)

    const createAcct =  new User({
        username, email, password:hashedPwd
    })

    await createAcct.save()
    
    const payload = {userid:createAcct._id, useremail:createAcct.email, username:createAcct.username}

    const token = jwt.sign(payload, jwt_key, {expiresIn:'15m'})
    
    if(token){
        res.cookie("accessToken", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 20*60*1000
        })
        
        return res.status(200).json({message:"User Created Successfully"})
    }
  }catch(err){
    res.status(500).json({err})
  }
});

app.post('/auth/signin', async(req, res)=>{
  try{
    const {email, password} = req.body

    const getRecordByEmail = await User.findOne({email}).select('+password')

    if(!getRecordByEmail)
      return res.status(404).json({message:"User Doesn't Exist"})

    const hashedPwd = getRecordByEmail.password
    const isMatched = await bcrypt.compare(password, hashedPwd)

    if(!isMatched)
      return res.status(401).json({message:"Credentials Doesn't Match"})

    const payload = {userid:getRecordByEmail._id, useremail:getRecordByEmail.email, username:getRecordByEmail.username}

    const token = jwt.sign(payload, jwt_key, {expiresIn:'15m'})
    
    if(token){
        res.cookie("accessToken", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60*60*1000
        })
        
        return res.status(200).json({message:"User Logedin Successfully"})
    }

  }catch(err){
    res.status(500).json({err})
  }
})

app.post('/auth/signout', auth, (req, res)=>{
  try{
    res.clearCookie("accessToken", {
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite:"lax"
    })

    return res.status(200).json({
      message:"Logout Successfully"
    })
  }catch(err){
    console.log(err)
    res.status(500).json({err})
  }
})

app.get("/auth/getUser", auth, (req, res)=>{
  try{
    const user_id = req.user.userid
    // console.log(req.user)
    if(!user_id) return res.status(404).json({errorInfo:{all:"Invalid User"}})
    return res.status(200).json({user_data:req.user})
  }catch(err){
    res.status(500).json({err})
  }
})

app.get("/employee/getAllEmployees", auth, async(req, res)=>{
  try{
    const user_id = req.user.userid
    const allEmployees = await Employee.find({company_id:user_id})

    if(!allEmployees)
      return res.status(404).json({message:"Can't Find Employees"})

    return res.status(202).json({allEmployees})
  }catch(err){
    res.status(500).json({err})
  }
})

app.post("/employee/createEmployee", auth, async(req, res)=>{
  try {
    // company_id retrieved from authenticated JWT (req.user) or fallback
    const company_id = req.user?.userid;

    const employee = await Employee.create({
      ...req.body,
      company_id,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    // Handle duplicate key error (MongoDB code 11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[1] || "Field";
      return res.status(400).json({
        message: `${duplicateField} '${error.keyValue[duplicateField]}' is already registered for this company.`,
      });
    }

    // Handle Mongoose schema validation failures
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
})

app.put("/employee/updateEmployee/:emplId", auth, async(req, res)=>{
  try {
    const { emplId } = req.params;

    // 1. Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(emplId)) {
      return res.status(400).json({ message: 'Invalid employee ID format.' });
    }

    // 2. Identify company scope (from auth middleware or fallback)
    const company_id = req.user?.userid;

    // 3. Find and update scoped strictly to this company
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: emplId, company_id },
      { $set: req.body },
      {
        new: true,           // Return the updated document instead of the original
        runValidators: true, // Enforce schema rules during update
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: 'Employee not found or you do not have permission to update this record.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: updatedEmployee,
    });
  } catch (error) {
    // Handle duplicate key error (code 11000) for unique fields (email or employeeId)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[1] || Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${duplicateField} '${error.keyValue[duplicateField]}' is already taken in this company.`,
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.patch("/employee/changeStatus/:emplId", auth, async(req, res)=>{
  try{
    const {emplId} = req.params
    const {isActive} = req.body
    const company_id = req.user?.userid;
    
    const updateStatus = await Employee.findOneAndUpdate({_id:emplId, company_id}, {$set:{isActive:!isActive}}, {new:true, runValidators:true})
    if(!updateStatus)
      return res.status(404).json({message:"Can't Find Employee"})
    
    return res.status(200).json({message:"Status of Employee Updated Successfully"})
  }catch(error){
    console.log(error)
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.get("/employee/getEmployeeByStatus", auth, async(req, res)=>{
  try {
    const rawCompanyId = req.user?.userid;
    const company_id = new mongoose.Types.ObjectId(rawCompanyId);

    // Compute all three metrics in a single database roundtrip
    const stats = await Employee.aggregate([
      { $match: { company_id } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [
            { $match: { isActive: true } },
            { $count: 'count' }
          ],
          inactive: [
            { $match: { isActive: false } },
            { $count: 'count' }
          ],
        },
      },
    ]);

    // Extract counts safely (defaulting to 0 if collection is empty)
    const totalEmployees = stats[0]?.total[0]?.count || 0;
    const activeEmployees = stats[0]?.active[0]?.count || 0;
    const inactiveEmployees = stats[0]?.inactive[0]?.count || 0;

    return res.status(200).json({
      success: true,
      data: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});