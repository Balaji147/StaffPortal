# StaffPortal - Employee Management System

A full-stack multi-tenant MERN application designed for managing company employees, handling authentication with secure HTTP-only cookies, and providing real-time data metrics.

---

## Features

- **Multi-Tenant Architecture**: Enforces company-level data isolation via `company_id` across User and Employee collections.
- **Authentication & Security**:
  - User sign-up and login with password hashing via `bcryptjs`.
  - JWT token issuance stored in secure HTTP-only cookies.
  - Route guards and protected layouts.
- **Employee Management**:
  - Full CRUD operations (Create, Read, Update, Status Toggle).
  - Unified modal supporting both Add and Edit actions.
  - Quick status toggling (Active / Inactive) with confirmation modal.
  - Client-side pagination and real-time name searching.
- **Dashboard Metrics**:
  - Real-time aggregated statistics for Total, Active, and Inactive personnel via MongoDB `$facet` pipeline.
- **Responsive UI**: Built using React and Tailwind CSS with custom responsive tables, inputs, and drawers.

---

## Tech Stack

- **Frontend**: React, React Router v6, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs, cookie-parser
