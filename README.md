# Smart-Inventory-and-Resource-Management-System

A centralized, intelligent platform for managing institutional and laboratory assets, maintenance workflows, and analytics.

## Project Description

The Smart Inventory and Resource Management System is a full-stack web application designed to digitize and streamline asset and laboratory management in educational institutions. It provides a secure, role-based system to manage assets, labs, faculty and lab technician workflows from a single unified platform.

The system goes beyond traditional inventory tracking by incorporating data analytics and scalable database design, it ensures transparency, audit readiness, and operational efficiency across departments.

## Features

### Core System Features

* **Role-Based Access Control (RBAC)**: Secure authentication and authorization for admins, faculty, technicians, and storekeepers using JWT-based sessions.

* **Centralized Asset & Lab Management**: Complete CRUD operations for assets, laboratories, PCs, and schedules with real-time status tracking.

* **Data-Driven Dashboards**: Interactive dashboards to visualize asset utilization, maintenance trends, and operational metrics.

* **Integrated Workflow Automation**: Automated workflows for asset allocation, maintenance reporting, issue resolution, and approvals.

* **Scalable Architecture**: Modular backend models and optimized database interactions designed for long-term scalability and maintainability.


## Tech Stack

### Frontend & Backend (Full Stack)

* **Next.js (App Router)**: Full-stack framework for UI and APIs

* **React**: Component-based UI development

* **Tailwind CSS / CSS Modules**: Responsive and modular styling

* **JWT Authentication**: Secure login, role-based access

* **Next.js API Routes**: Backend logic and RESTful endpoints

### Database

* **MongoDB Atlas**: Cloud-hosted NoSQL database

* **Mongoose**: Schema modeling and data validation

### DevOps & Utilities

* **Git & GitHub**: Version control

* **Vercel** Deployment platforms

## Architecture

<img width="1150" height="295" alt="image" src="https://github.com/user-attachments/assets/f124ce79-3fdd-4eae-8ab4-61b0c7c38c6f" />

## Project Structure
```bash
├── src
    ├── lib
    │   └── auth.js
    ├── app
    │   ├── api
    │   │   ├── assets
    │   │   │   ├── route.js
    │   │   │   └── [id]
    │   │   │   │   └── route.js
    │   │   ├── auth
    │   │   │   ├── [...nextauth]
    │   │   │   │   ├── authOptions.js
    │   │   │   │   └── route.js
    │   │   │   ├── verify
    │   │   │   │   └── route.js
    │   │   │   ├── userDetails
    │   │   │   │   └── route.js
    │   │   │   ├── profilePic
    │   │   │   │   └── route.js
    │   │   │   ├── logout
    │   │   │   │   └── route.js
    │   │   │   ├── signup
    │   │   │   │   └── route.js
    │   │   │   ├── profile
    │   │   │   │   └── route.js
    │   │   │   ├── onboarding
    │   │   │   │   └── route.js
    │   │   │   └── login
    │   │   │   │   └── route.js
    │   │   ├── admin
    │   │   │   ├── getlabPCs
    │   │   │   │   └── route.js
    │   │   │   ├── getLabs
    │   │   │   │   └── route.js
    │   │   │   ├── getlabTechnicians
    │   │   │   │   └── route.js
    │   │   │   ├── getProgram
    │   │   │   │   └── route.js
    │   │   │   ├── getPcById
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── getAssetBreakdown
    │   │   │   │   └── route.js
    │   │   │   ├── getLabById
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── addSubject
    │   │   │   │   └── route.js
    │   │   │   ├── getDashboardProgram
    │   │   │   │   └── route.js
    │   │   │   ├── addLabPCs
    │   │   │   │   └── route.js
    │   │   │   ├── addLabMoreInfo
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── addEventNotify
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── getSubjects
    │   │   │   │   └── route.js
    │   │   │   ├── addAsset
    │   │   │   │   └── route.js
    │   │   │   ├── labAssetSummary
    │   │   │   │   └── route.js
    │   │   │   ├── editTimetableSlot
    │   │   │   │   └── [timetableId]
    │   │   │   │   │   └── route.js
    │   │   │   ├── getFaculty
    │   │   │   │   └── route.js
    │   │   │   ├── bookTimetableSlot
    │   │   │   │   └── route.js
    │   │   │   ├── addProgram
    │   │   │   │   └── route.js
    │   │   │   ├── getLabSubject
    │   │   │   │   └── route.js
    │   │   │   ├── addLabTechnician
    │   │   │   │   └── route.js
    │   │   │   ├── editLabTechnician
    │   │   │   │   └── route.js
    │   │   │   ├── updateProgram
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── uploadListOfExperiment
    │   │   │   │   └── route.js
    │   │   │   ├── addLab
    │   │   │   │   └── route.js
    │   │   │   ├── getLabDetail
    │   │   │   │   └── [labId]
    │   │   │   │   │   └── route.js
    │   │   │   ├── editLabs
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── addFaculty
    │   │   │   │   └── route.js
    │   │   │   ├── editFaculty
    │   │   │   │   └── route.js
    │   │   │   └── getMetricsCount
    │   │   │   │   └── route.js
    │   │   ├── utils
    │   │   │   ├── db.js
    │   │   │   └── generateQR.js
    │   │   ├── lab_technician
    │   │   │   ├── getAssetBreakdown
    │   │   │   │   └── route.js
    │   │   │   ├── getLabById
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── getPcById
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── addLabPCs
    │   │   │   │   └── route.js
    │   │   │   ├── getLabs
    │   │   │   │   └── route.js
    │   │   │   ├── getlabPCs
    │   │   │   │   └── route.js
    │   │   │   ├── addLabMoreInfo
    │   │   │   │   └── [id]
    │   │   │   │   │   └── route.js
    │   │   │   ├── resolveIssue
    │   │   │   │   └── route.js
    │   │   │   ├── addLab
    │   │   │   │   └── route.js
    │   │   │   ├── addAsset
    │   │   │   │   └── route.js
    │   │   │   ├── editTimetableSlot
    │   │   │   │   └── [timetableId]
    │   │   │   │   │   └── route.js
    │   │   │   ├── bookTimetableSlot
    │   │   │   │   └── route.js
    │   │   │   ├── getLabSubject
    │   │   │   │   └── route.js
    │   │   │   ├── uploadListOfExperiment
    │   │   │   │   └── route.js
    │   │   │   └── getMetricsCount
    │   │   │   │   └── route.js
    │   │   └── faculty
    │   │   │   ├── getLabById
    │   │   │       └── [id]
    │   │   │       │   └── route.js
    │   │   │   ├── getFacultyDistribution
    │   │   │       └── route.js
    │   │   │   ├── getPcById
    │   │   │       └── [id]
    │   │   │       │   └── route.js
    │   │   │   ├── approveIssueResolve
    │   │   │       └── route.js
    │   │   │   ├── fetchInchargeLab
    │   │   │       └── route.js
    │   │   │   ├── getProgram
    │   │   │       └── route.js
    │   │   │   ├── raiseIssue
    │   │   │       └── route.js
    │   │   │   ├── editTimetableSlot
    │   │   │       └── [timetableId]
    │   │   │       │   └── route.js
    │   │   │   ├── bookTimetableSlot
    │   │   │       └── route.js
    │   │   │   ├── getLabSubject
    │   │   │       └── route.js
    │   │   │   ├── getLabs
    │   │   │       └── route.js
    │   │   │   ├── getSubjects
    │   │   │       └── route.js
    │   │   │   └── getlabPCs
    │   │   │       └── route.js
    │   ├── providers.js
    │   ├── facultyPanel
    │   │   ├── layout.js
    │   │   ├── styles
    │   │   │   └── globals.css
    │   │   ├── FacultyLayout.module.css
    │   │   ├── layoutClient.js
    │   │   ├── components
    │   │   │   ├── facultyNavbar.js
    │   │   │   └── facultyNavbar.module.css
    │   │   └── profile
    │   │   │   └── page.js
    │   ├── lab_technicianPanel
    │   │   ├── layout.js
    │   │   ├── styles
    │   │   │   └── globals.css
    │   │   ├── TechnicianLayout.module.css
    │   │   ├── layoutClient.js
    │   │   ├── components
    │   │   │   ├── labNavbar.js
    │   │   │   └── labNavbar.module.css
    │   │   └── profile
    │   │   │   └── page.js
    │   ├── unauthorized
    │   │   └── page.js
    │   ├── styles
    │   │   └── globals.css
    │   ├── adminPanel
    │   │   ├── styles
    │   │   │   └── globals.css
    │   │   ├── layout.js
    │   │   ├── AdminLayout.module.css
    │   │   ├── components
    │   │   │   ├── adminNavbar.js
    │   │   │   └── adminNavbar.module.css
    │   │   └── profile
    │   │   │   └── page.js
    │   ├── layout.js
    │   ├── components
    │   │   └── navbar.js
    │   ├── qrRedirect
    │   │   └── page.js
    │   ├── redirectAfterLogin
    │   │   └── page.js
    │   └── signup
    │   │   └── page.js
    ├── models
    │   ├── Lab_PCs.js
    │   ├── Subject_List.js
    │   ├── Lab_Technician.js
    │   ├── Programs.js
    │   ├── Timetable.js
    │   ├── Faculty.js
    │   ├── Asset.js
    │   ├── Labs.js
    │   └── User.js
    ├── context
    │   └── SessionContext.js
    └── middleware.js
├── public
    ├── logo.png
    ├── Fulllogo.jpg
    ├── profile.png
    ├── DP_uploads
    ├── ListOfExperiment_uploads
├── .gitignore
├── package.json
└── README.md
```
