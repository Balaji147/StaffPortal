const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('../models/employees.model.js');

const COMPANY_ID = new mongoose.Types.ObjectId('6a9ba6eb1c6c8af499b9de27');

const rawEmployees = [
  { employeeId: 'EMP-1001', firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@company.com', phone: '+1-555-0101', department: 'Engineering', designation: 'Staff Software Engineer', salary: 135000, joiningDate: new Date('2021-03-15'), isActive: true },
  { employeeId: 'EMP-1002', firstName: 'Elena', lastName: 'Rostova', email: 'elena.rostova@company.com', phone: '+1-555-0102', department: 'Engineering', designation: 'Frontend Developer', salary: 92000, joiningDate: new Date('2022-07-01'), isActive: true },
  { employeeId: 'EMP-1003', firstName: 'Tariq', lastName: 'Mansoor', email: 'tariq.mansoor@company.com', phone: '+1-555-0103', department: 'Engineering', designation: 'DevOps Engineer', salary: 110000, joiningDate: new Date('2023-01-10'), isActive: true },
  { employeeId: 'EMP-1004', firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah.jenkins@company.com', phone: '+1-555-0104', department: 'HR', designation: 'Head of People Operations', salary: 105000, joiningDate: new Date('2020-11-20'), isActive: true },
  { employeeId: 'EMP-1005', firstName: 'Devon', lastName: 'Miles', email: 'devon.miles@company.com', phone: '+1-555-0105', department: 'HR', designation: 'Talent Acquisition Specialist', salary: 68000, joiningDate: new Date('2023-05-12'), isActive: false },
  { employeeId: 'EMP-1006', firstName: 'Aaliyah', lastName: 'Patel', email: 'aaliyah.patel@company.com', phone: '+1-555-0106', department: 'Finance', designation: 'Senior Financial Analyst', salary: 98000, joiningDate: new Date('2021-09-01'), isActive: true },
  { employeeId: 'EMP-1007', firstName: 'Lucas', lastName: 'Silva', email: 'lucas.silva@company.com', phone: '+1-555-0107', department: 'Finance', designation: 'Staff Accountant', salary: 72000, joiningDate: new Date('2022-02-14'), isActive: true },
  { employeeId: 'EMP-1008', firstName: 'Chloe', lastName: 'Bennett', email: 'chloe.bennett@company.com', phone: '+1-555-0108', department: 'Marketing', designation: 'VP of Marketing', salary: 140000, joiningDate: new Date('2020-04-01'), isActive: true },
  { employeeId: 'EMP-1009', firstName: 'Kenji', lastName: 'Sato', email: 'kenji.sato@company.com', phone: '+1-555-0109', department: 'Marketing', designation: 'Content & SEO Strategist', salary: 64000, joiningDate: new Date('2023-08-15'), isActive: true },
  { employeeId: 'EMP-1010', firstName: 'Zoe', lastName: 'Kowalski', email: 'zoe.kowalski@company.com', phone: '+1-555-0110', department: 'Sales', designation: 'Enterprise Account Executive', salary: 115000, joiningDate: new Date('2022-04-18'), isActive: true },
  { employeeId: 'EMP-1011', firstName: 'Mateo', lastName: 'Hernandez', email: 'mateo.hernandez@company.com', phone: '+1-555-0111', department: 'Sales', designation: 'Sales Development Rep', salary: 58000, joiningDate: new Date('2024-01-08'), isActive: true },
  { employeeId: 'EMP-1012', firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@company.com', phone: '+1-555-0112', department: 'Operations', designation: 'Director of Operations', salary: 128000, joiningDate: new Date('2019-10-01'), isActive: true },
  { employeeId: 'EMP-1013', firstName: 'Liam', lastName: 'O’Connor', email: 'liam.oconnor@company.com', phone: '+1-555-0113', department: 'Operations', designation: 'Logistics Coordinator', salary: 61000, joiningDate: new Date('2023-03-20'), isActive: false },
  { employeeId: 'EMP-1014', firstName: 'Amina', lastName: 'Diallo', email: 'amina.diallo@company.com', phone: '+1-555-0114', department: 'Engineering', designation: 'Backend Architect', salary: 130000, joiningDate: new Date('2021-06-11'), isActive: true },
  { employeeId: 'EMP-1015', firstName: 'Noah', lastName: 'Dubois', email: 'noah.dubois@company.com', phone: '+1-555-0115', department: 'Engineering', designation: 'QA Automation Lead', salary: 95000, joiningDate: new Date('2022-10-03'), isActive: true },
  { employeeId: 'EMP-1016', firstName: 'Grace', lastName: 'Hopper-Lee', email: 'grace.hopperlee@company.com', phone: '+1-555-0116', department: 'Engineering', designation: 'Full Stack Engineer', salary: 88000, joiningDate: new Date('2023-11-01'), isActive: true },
  { employeeId: 'EMP-1017', firstName: 'Julian', lastName: 'Mercer', email: 'julian.mercer@company.com', phone: '+1-555-0117', department: 'Sales', designation: 'Customer Success Manager', salary: 82000, joiningDate: new Date('2022-08-22'), isActive: true },
  { employeeId: 'EMP-1018', firstName: 'Maya', lastName: 'Lin', email: 'maya.lin@company.com', phone: '+1-555-0118', department: 'Marketing', designation: 'Product Marketing Manager', salary: 102000, joiningDate: new Date('2021-12-05'), isActive: true },
  { employeeId: 'EMP-1019', firstName: 'Caleb', lastName: 'Fischer', email: 'caleb.fischer@company.com', phone: '+1-555-0119', department: 'Finance', designation: 'Payroll Specialist', salary: 67000, joiningDate: new Date('2023-06-19'), isActive: false },
  { employeeId: 'EMP-1020', firstName: 'Siddharth', lastName: 'Sharma', email: 'siddharth.sharma@company.com', phone: '+1-555-0120', department: 'Operations', designation: 'Systems Administrator', salary: 89000, joiningDate: new Date('2022-05-30'), isActive: true },
];

// Append company_id to all seed documents
const seededEmployees = rawEmployees.map((emp) => ({
  ...emp,
  company_id: COMPANY_ID,
}));

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_mngr';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');

    // Remove only existing records associated with this company
    const deleted = await Employee.deleteMany({ company_id: COMPANY_ID });
    console.log(`Cleared ${deleted.deletedCount} existing employees for company ${COMPANY_ID}`);

    // Insert records
    await Employee.insertMany(seededEmployees);
    console.log(`Successfully seeded ${seededEmployees.length} employees for company ${COMPANY_ID}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();