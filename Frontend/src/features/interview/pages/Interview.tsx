import React, { useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { Link, useParams } from "react-router";

const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "roadmap", label: "Road Map" },
];

const QuestionCard = ({ item, index }: { item: any; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="q-card">
      <div className="q-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
      </div>
      {open && (
        <div className="q-card__body">
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--intention">
              Intention
            </span>
            <p>{item.intention}</p>
          </div>
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--answer">
              Model Answer
            </span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }: { day: any }) => (
  <div className="roadmap-day">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>
      <h3 className="roadmap-day__focus">{day.focus}</h3>
    </div>
    <ul className="roadmap-day__tasks">
      {day.tasks.map((task: string, i: number) => (
        <li key={i}>
          <span className="roadmap-day__bullet" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { report, loading, error, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader" aria-label="Loading" />
        <h1>Loading your interview plan</h1>
        <p>AI-generated plans may take a few seconds to retrieve.</p>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="empty-screen">
        <div className="alert alert--error">
          {error || "This interview plan could not be loaded."}
        </div>
        <Link className="button primary-button" to="/">
          Back to plans
        </Link>
      </main>
    );
  }

  const scoreColor =
    (report.matchScore || 0) >= 80
      ? "score--high"
      : (report.matchScore || 0) >= 60
        ? "score--mid"
        : "score--low";

  return (
    <div className="interview-page">
      <div className="interview-layout">
        <nav className="interview-nav">
          <div className="nav-content">
            <Link className="back-link" to="/">
              Back to plans
            </Link>
            <p className="interview-nav__label">Sections</p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${activeNav === item.id ? "interview-nav__item--active" : ""}`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              getResumePdf(interviewId);
            }}
            className="button primary-button"
            disabled={loading}
          >
            Download Resume
          </button>
        </nav>

        <div className="interview-divider" />

        <main className="interview-content">
          {activeNav === "technical" && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>
                <span className="content-header__count">
                  {(report.technicalQuestions || []).length} questions
                </span>
              </div>
              <div className="q-list">
                {(report.technicalQuestions || []).map((q: any, i: number) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
                {(report.technicalQuestions || []).length === 0 && (
                  <p className="empty-state">No technical questions were generated for this plan.</p>
                )}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>
                <span className="content-header__count">
                  {(report.behavioralQuestions || []).length} questions
                </span>
              </div>
              <div className="q-list">
                {(report.behavioralQuestions || []).map((q: any, i: number) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
                {(report.behavioralQuestions || []).length === 0 && (
                  <p className="empty-state">No behavioral questions were generated for this plan.</p>
                )}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>
                <span className="content-header__count">
                  {(report.preparationPlan || []).length}-day plan
                </span>
              </div>
              <div className="roadmap-list">
                {(report.preparationPlan || []).map((day: any) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
                {(report.preparationPlan || []).length === 0 && (
                  <p className="empty-state">No preparation road map was generated for this plan.</p>
                )}
              </div>
            </section>
          )}
        </main>

        <div className="interview-divider" />

        <aside className="interview-sidebar">
          {error && <div className="alert alert--error">{error}</div>}
          <div className="match-score">
            <p className="match-score__label">Match Score</p>
            <div className={`match-score__ring ${scoreColor}`}>
              <span className="match-score__value">{report.matchScore}</span>
              <span className="match-score__pct">%</span>
            </div>
            <p className="match-score__sub">
              {(report.matchScore || 0) >= 80
                ? "Strong match for this role"
                : (report.matchScore || 0) >= 60
                  ? "Good match with gaps"
                  : "Focused preparation needed"}
            </p>
          </div>

          <div className="sidebar-divider" />

          <div className="skill-gaps">
            <p className="skill-gaps__label">Skill Gaps</p>
            <div className="skill-gaps__list">
              {(report.skillGaps || []).map((gap: any, i: number) => (
                <span
                  key={i}
                  className={`skill-tag skill-tag--${gap.severity}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
