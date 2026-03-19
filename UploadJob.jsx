// =============================================================================================
//  FILE: frontend/src/components/UploadJob.jsx
// =============================================================================================
//
//  PURPOSE OF THIS FILE (BEGINNER-FRIENDLY EXPLANATION):
// ---------------------------------------------------------------------------------------------
// This React component is the **Job Creation Page** for your ML-Based Resume Screening System.
//
//  It lets the user (like an HR manager or recruiter) create a new job entry
// by entering:
//    Job Title
//    Job Description
//    List of Required Skills (comma-separated)
//
// Once submitted, it sends this information to the FastAPI backend (POST /api/jobs),
// where the job is stored in the **PostgreSQL database**.
//
// After successful creation, it automatically redirects the user to the
// **Upload Resume** page with that job pre-selected.
//
// ---------------------------------------------------------------------------------------------
//  WINDOWS PATH (for your setup):
//   C:\pbldbms\frontend\src\components\UploadJob.jsx
//
// ▶ To Run on Windows PowerShell:
//   cd C:\pbldbms\frontend
//   npm run dev
//   → open http://localhost:5173
//
// =============================================================================================


// ---------------------------------------------------------------------------------------------
//  STEP 1️: IMPORT REQUIRED LIBRARIES
// ---------------------------------------------------------------------------------------------
import React, { useState } from "react";         // React + state hook to manage form inputs
import api from "../api";                        // axios instance to connect to FastAPI backend
import { toast } from "react-toastify";          // popup notifications (success/error/warning)
import { useNavigate } from "react-router-dom";  // navigation hook to redirect between pages


// =============================================================================================
//  STEP 2️: DEFINE MAIN COMPONENT — UploadJob()
// =============================================================================================
//
// This is a React function component (lightweight, reusable UI block).
// It handles both the **frontend UI** and the **form submission logic**.
// ---------------------------------------------------------------------------------------------
export default function UploadJob() {

  // -------------------------------------------------------------------------------------------
  //  STATE VARIABLES (React useState Hooks)
  // -------------------------------------------------------------------------------------------
  //
  // These variables hold live user input from form fields.
  // Whenever user types in the input box, state is updated automatically.
  // -------------------------------------------------------------------------------------------
  const [title, setTitle] = useState("");            // Job title input (e.g. “ML Engineer”)
  const [description, setDescription] = useState(""); // Job description / details
  const [skillsText, setSkillsText] = useState("");  // Raw skill text (comma separated)
  const [loading, setLoading] = useState(false);     // Loader flag while sending data
  const navigate = useNavigate();                    // Used to navigate (redirect) between pages


  // -------------------------------------------------------------------------------------------
  //  STEP 3️: HANDLE FORM SUBMISSION (handleSubmit)
  // -------------------------------------------------------------------------------------------
  //
  // Triggered when user clicks “Create Job” button.
  // Prevents default form refresh, validates inputs, then sends POST request to backend.
  //
  // Endpoint called: POST /api/jobs
  // Backend: defined in FastAPI (backend/app/main.py)
  // -------------------------------------------------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault(); // prevent browser from reloading the page

    // Step 1: Validation — check if job title exists
    if (!title.trim()) {
      toast.warn("⚠️ Please enter a job title.");
      return;
    }

    //  Step 2: Convert comma-separated skills → array
    // Example input: "python, ml, docker" → ["python", "ml", "docker"]
    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    //  Step 3: Prepare data payload for backend
    const payload = {
      title: title.trim(),
      description: description.trim(),
      skills,
    };

    //  Step 4: Send POST request to backend
    try {
      setLoading(true); // disable button, show loader text
      const res = await api.post("/api/jobs", payload);

      // Extract new job ID from backend response
      const jobId = res?.data?.job_id;
      toast.success(`✅ Created job successfully (ID: ${jobId})`);

      // Redirect user to Upload Resume page with this job pre-selected
      if (jobId) {
        navigate(`/upload-resume?jobId=${jobId}`);
      } else {
        // if no ID returned, just clear the form
        setTitle("");
        setDescription("");
        setSkillsText("");
      }

    } catch (err) {
      // Handle any backend or network errors
      console.error("Create job error", err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to create job";
      toast.error(`❌ Error: ${detail}`);
    } finally {
      setLoading(false); // re-enable button
    }
  }


  // ===========================================================================================
  //  STEP 4️: FRONTEND FORM LAYOUT (JSX)
  // ===========================================================================================
  //
  // Simple, card-styled form with inputs for job info and action buttons.
  // All input boxes are linked to React state using “value” and “onChange”.
  // -------------------------------------------------------------------------------------------
  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <div className="card-title">Create Job</div>

        {/* FORM START */}
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          {/* ----------- JOB TITLE ----------- */}
          <div>
            <label className="small">Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Assistant Professor - ML"
              required
            />
          </div>

          {/* ----------- DESCRIPTION ----------- */}
          <div>
            <label className="small">Description</label>
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Job description / responsibilities..."
            />
          </div>

          {/* ----------- SKILLS ----------- */}
          <div>
            <label className="small">Skills (comma separated)</label>
            <input
              className="input"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="python, ml, fastapi, docker"
            />
          </div>

          {/* ----------- BUTTONS ----------- */}
          <div className="button-row">
            {/* Submit */}
            <button type="submit" disabled={loading} className="btn">
              {loading ? "Creating..." : "Create Job"}
            </button>

            {/* Reset */}
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setTitle("");
                setDescription("");
                setSkillsText("");
              }}
            >
              Reset
            </button>
          </div>

          {/* ----------- FOOTER NOTE ----------- */}
          <div className="footer-note">
            After creating, you'll be redirected to Upload Resume with the job selected.
          </div>
        </form>
      </div>
    </div>
  );
}


// =============================================================================================
//  HOW THIS COMPONENT FITS INTO THE PROJECT
// =============================================================================================
//
// 1️ User creates a new job → This page sends a POST request to backend.
// 2️ Backend stores job info in PostgreSQL (table: jobs).
// 3️ Response returns job_id.
// 4️ Frontend redirects user to Upload Resume page:
//     - where resumes can be uploaded and linked to that job.
// 5️ Later, Dashboard.jsx uses this job to visualize ranking charts.
//
//  Related backend endpoint (FastAPI):
//     @app.post("/api/jobs")
//     def create_job(...):  # stores job title, description, skills
//
// =============================================================================================


// =============================================================================================
//  WINDOWS-SPECIFIC SETUP & NOTES
// =============================================================================================
//
// ▶ Run the frontend in PowerShell:
//   cd C:\pbldbms\frontend
//   npm run dev
//   → open http://localhost:5173
//
// ▶ Backend (FastAPI) should be running in another PowerShell window:
//   cd C:\pbldbms\backend
//   .\venv\Scripts\Activate.ps1
//   uvicorn app.main:app --reload
//
// ▶ Toast Notifications:
//   Ensure <ToastContainer /> is present in your App.jsx file
//   to display popup messages (React Toastify).
//
// ▶ Debugging Tips on Windows:
//   ⚠️ “Error: Failed to create job”
//        → Backend not running, or database connection failed.
//   ⚠️ “Cannot POST /api/jobs”
//        → Check API base URL (in frontend/src/api.js).
//   ⚙️ “Job created but not redirected”
//        → Check navigate() route name in React Router (must match UploadResume path).
//
// ▶ File Saving (VS Code):
//   Save this file (Ctrl + S) → Browser auto-refreshes via Vite live reload.
//
// =============================================================================================
//
// ✅ TL;DR (BEGINNER SUMMARY):
// ---------------------------------------------------------------------------------------------
// 🟢 This component creates a new job posting (Title, Description, Skills).
// 🟢 It sends the data to FastAPI backend via POST /api/jobs.
// 🟢 On success, it redirects user to the Upload Resume page.
// 🟢 Designed to be simple, works seamlessly on Windows PowerShell.
// 🟢 All form inputs are connected via React state and update in real time.
// =============================================================================================
