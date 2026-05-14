import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { InterviewReport } from "../interview.context";
import { useNavigate } from "react-router";

const Home = () => {
  const { loading, error, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [formError, setFormError] = useState("");
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];
    const hasProfile = Boolean(resumeFile || selfDescription.trim());

    if (!jobDescription.trim()) {
      setFormError(
        "Paste the target job description before generating a plan.",
      );
      return;
    }

    if (!hasProfile) {
      setFormError(
        "Add a resume or a short self-description so the AI can personalize the plan.",
      );
      return;
    }

    setFormError("");
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (data?._id) navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader" aria-label="Loading" />
        <h1>Preparing your interview workspace</h1>
        <p>AI responses can take longer on the free model tier.</p>
      </main>
    );
  }

  return (
    <div className="home-page">
      {/* Page Header */}
      <header className="page-header">
        <p className="section-kicker">Interview Preparation</p>
        <h1>
          Create a focused <span className="highlight">interview plan</span>
        </h1>
        <p>
          Paste the role, add your profile, and generate questions, skill gaps,
          and a practical preparation road map.
        </p>
      </header>

      {/* Main Card */}
      <div className="interview-card">
        <div className="interview-card__body">
          <div className="panel panel--left">
            <div className="panel__header">
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              className="panel__textarea"
              placeholder={`Paste the full job description here...`}
              maxLength={5000}
            />
            <div className="char-counter">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          <div className="panel-divider" />

          <div className="panel panel--right">
            <div className="panel__header">
              <h2>Your Profile</h2>
            </div>

            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>
              <label className="dropzone" htmlFor="resume">
                <p className="dropzone__title">
                  {resumeFileName || "Click to upload your resume"}
                </p>
                <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                <input
                  ref={resumeInputRef}
                  onChange={(event) => {
                    setResumeFileName(event.target.files?.[0]?.name || "");
                    setFormError("");
                  }}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                />
              </label>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                value={selfDescription}
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience..."
              />
            </div>

            <div className="info-box">
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        <div className="interview-card__footer">
          <span className="footer-info">
            Free AI model tier can rate limit during heavy traffic.
          </span>
          <button
            onClick={handleGenerateReport}
            className="generate-btn"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate interview strategy"}
          </button>
        </div>
      </div>

      <div className="notice-stack">
        <div className="alert alert--warning">
          This app uses free AI models. If the provider rate limits a request,
          wait briefly and submit again.
        </div>
        {(formError || error) && (
          <div className="alert alert--error">{formError || error}</div>
        )}
      </div>

      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>Recent interview plans</h2>
          <ul className="reports-list">
            {reports.map((report: InterviewReport) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}` as any)}
              >
                <h3>{report.title || "Untitled Position"}</h3>
                <p className="report-meta">
                  Generated on{" "}
                  {new Date(report.createdAt as string).toLocaleDateString()}
                </p>
                <p
                  className={`match-score ${(report.matchScore || 0) >= 80 ? "score--high" : (report.matchScore || 0) >= 60 ? "score--mid" : "score--low"}`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Home;
