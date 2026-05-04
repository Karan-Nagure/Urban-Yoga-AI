import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import hero from "../../utils/images/hero.jpg";
import img1 from "../../utils/images/img1.jpeg";
import img2 from "../../utils/images/img2.png";
import img3 from "../../utils/images/img3.jpeg";
import "./Home.css";

const poses = [
  { name: "Tree", emoji: "🌳", difficulty: "Easy" },
  { name: "Chair", emoji: "🪑", difficulty: "Easy" },
  { name: "Cobra", emoji: "🐍", difficulty: "Easy" },
  { name: "Warrior", emoji: "⚔️", difficulty: "Hard" },
  { name: "Dog", emoji: "🐕", difficulty: "Medium" },
  { name: "Triangle", emoji: "🔺", difficulty: "Medium" },
  { name: "Shoulderstand", emoji: "🤸", difficulty: "Hard" },
  { name: "Lotus", emoji: "🪷", difficulty: "Medium" },
  { name: "Pigeon", emoji: "🕊️", difficulty: "Medium" },
  { name: "Bridge", emoji: "🌉", difficulty: "Easy" },
];

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-root">
      {/* NAV */}
      <nav className="home-nav">
        <div className="nav-brand">
          <span className="nav-dot" />
          <span className="nav-logo-text">Urban<em>Yoga</em></span>
        </div>
        <div className="nav-links">
          <Link to="/tutorials" className="nav-link">Tutorials</Link>
          <Link to="/about" className="nav-link">About</Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-link nav-profile-btn">
                <span className="nav-avatar" style={{ background: user.avatar_color || '#7a9e7e' }}>
                  {(user.full_name || user.username || 'U').slice(0,1).toUpperCase()}
                </span>
                {user.username}
              </Link>
              <Link to="/start" className="nav-cta">Start Practice</Link>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link">Sign In</Link>
              <Link to="/register" className="nav-cta">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg-blur blur-1" />
        <div className="hero-bg-blur blur-2" />
        <div className="hero-bg-blur blur-3" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge reveal">
              <span className="badge-dot" />
              AI-Powered Pose Detection
            </div>
            <h1 className="hero-title reveal">
              Move Better.<br />
              <span className="title-accent">Feel Better.</span><br />
              Every Day.
            </h1>
            <p className="hero-subtitle reveal">
              Real-time yoga coaching powered by computer vision.
              Your camera watches your form and gives instant feedback —
              no instructor needed.
            </p>
            <div className="hero-actions reveal">
              <Link to="/start">
                <button className="btn-primary-hero">
                  <span>Begin Session</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
              <Link to="/tutorials">
                <button className="btn-ghost-hero">How it works</button>
              </Link>
            </div>
            <div className="hero-stats reveal">
              <div className="stat">
                <span className="stat-num">10+</span>
                <span className="stat-label">Yoga Poses</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">Real-time</span>
                <span className="stat-label">AI Feedback</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">Free</span>
                <span className="stat-label">Always</span>
              </div>
            </div>
          </div>
          <div className="hero-right reveal">
            <div className="hero-image-frame">
              <div className="frame-glow" />
              <img src={hero} alt="Yoga practice" className="hero-img" />
              <div className="hero-badge-float">
                <div className="float-icon">✓</div>
                <div>
                  <div className="float-title">Pose Detected</div>
                  <div className="float-sub">Tree Pose — 97% match</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POSE TICKER */}
      <div className="pose-ticker-wrapper">
        <div className="pose-ticker">
          <div className="ticker-track">
            {[...poses, ...poses].map((p, i) => (
              <div className="ticker-pill" key={i}>
                <span>{p.emoji}</span>
                <span>{p.name}</span>
                <span className={`diff-badge diff-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-inner">
          <div className="section-label reveal">How it works</div>
          <h2 className="section-title reveal">Three steps to better yoga</h2>
          <div className="steps-grid">
            {[
              { num: "01", icon: "📱", title: "Allow Camera", desc: "Grant camera access so the AI can see your body position in real time." },
              { num: "02", icon: "🧘", title: "Choose a Pose", desc: "Pick from 10+ guided poses with detailed step-by-step instructions." },
              { num: "03", icon: "✨", title: "Get Feedback", desc: "The skeleton overlay turns green when your pose is correct. Hold it and improve!" },
            ].map((step, i) => (
              <div className="step-card reveal" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="features-inner">
          <div className="section-label reveal">What's inside</div>
          <h2 className="section-title reveal">Everything you need to practice</h2>
          <div className="features-grid">
            <div className="feature-card feature-large reveal">
              <div className="feature-img-wrap"><img src={img1} alt="Guided yoga" /></div>
              <div className="feature-text">
                <h3>Guided Yoga Flows</h3>
                <p>Calm, structured poses designed for beginners and busy schedules.</p>
              </div>
            </div>
            <div className="feature-card reveal">
              <div className="feature-img-wrap"><img src={img2} alt="Breathing" /></div>
              <div className="feature-text">
                <h3>Breathing Exercises</h3>
                <p>Easy breathing techniques to reduce stress in minutes.</p>
              </div>
            </div>
            <div className="feature-card reveal">
              <div className="feature-img-wrap"><img src={img3} alt="Daily routines" /></div>
              <div className="feature-text">
                <h3>Daily Routines</h3>
                <p>Short sessions you can do anytime — build lasting consistency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POSE SHOWCASE */}
      <section className="poses-section">
        <div className="poses-inner">
          <div className="section-label reveal">Pose library</div>
          <h2 className="section-title reveal">Explore all poses</h2>
          <div className="poses-grid">
            {poses.map((pose, i) => (
              <div className="pose-pill reveal" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="pose-emoji">{pose.emoji}</span>
                <span className="pose-name">{pose.name}</span>
                <span className={`diff-badge diff-${pose.difficulty.toLowerCase()}`}>{pose.difficulty}</span>
              </div>
            ))}
          </div>
          <div className="poses-cta reveal">
            <Link to="/start">
              <button className="btn-primary-hero">
                <span>Try All Poses</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="nav-brand">
            <span className="nav-dot" />
            <span className="nav-logo-text">Urban<em>Yoga</em></span>
          </div>
          <p className="footer-text">Built with TensorFlow.js &amp; MoveNet · Open source &amp; free forever</p>
          <div className="footer-links">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/tutorials" className="nav-link">Tutorials</Link>
            <Link to="/start" className="nav-link">Practice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
