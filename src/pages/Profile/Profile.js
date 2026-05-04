import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { api } from '../../utils/api';
import './Profile.css';

const AVATAR_COLORS = ['#7a9e7e','#c9714a','#5b8db8','#9b6b9e','#d4a843','#e07b7b','#4a9e8e'];

const GOALS = [
  'Weight Loss','Stress Relief','Flexibility','Strength Building',
  'Better Sleep','Mindfulness','Injury Recovery','General Fitness',
];

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isEditing = location.pathname === '/profile/edit';

  const [profile, setProfile] = useState(null);
  const [stats,   setStats]   = useState([]);
  const [sessions,setSessions]= useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    full_name: '', age: '', gender: 'Prefer not to say',
    height_cm: '', weight_kg: '', fitness_goal: '', bio: '',
    avatar_color: '#7a9e7e',
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prof, st, sess] = await Promise.all([
        api.getProfile(), api.getStats(), api.getSessions(),
      ]);
      setProfile(prof);
      setStats(st);
      setSessions(sess.slice(0, 10)); // last 10
      setForm({
        full_name:    prof.full_name    || '',
        age:          prof.age          || '',
        gender:       prof.gender       || 'Prefer not to say',
        height_cm:    prof.height_cm    || '',
        weight_kg:    prof.weight_kg    || '',
        fitness_goal: prof.fitness_goal || '',
        bio:          prof.bio          || '',
        avatar_color: prof.avatar_color || '#7a9e7e',
      });
    } catch (err) {
      setError('Could not load profile. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      await api.updateProfile(form);
      await refreshUser();
      setSuccess('Profile saved successfully!');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const totalSec  = stats.reduce((a, s) => a + Number(s.total_time_sec), 0);
  const totalSess = stats.reduce((a, s) => a + Number(s.total_sessions), 0);
  const initials  = (profile?.full_name || profile?.username || 'U').slice(0,2).toUpperCase();

  if (loading) return (
    <div className="profile-loading">
      <div className="profile-spinner" />
      <p>Loading your profile…</p>
    </div>
  );

  return (
    <div className="profile-root">
      {/* Header */}
      <header className="profile-header">
        <Link to="/" className="auth-brand" style={{ textDecoration:'none' }}>
          <span className="auth-brand-dot" />
          <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:'1.15rem' }}>
            Urban<em style={{ color:'#c9714a', fontStyle:'italic' }}>Yoga</em>
          </span>
        </Link>
        <div className="profile-header-actions">
          <Link to="/start" className="ph-btn">Practice</Link>
          {isEditing
            ? <Link to="/profile" className="ph-btn ph-outline">View Profile</Link>
            : <Link to="/profile/edit" className="ph-btn ph-outline">Edit Profile</Link>
          }
          <button onClick={handleLogout} className="ph-btn ph-danger">Log Out</button>
        </div>
      </header>

      <div className="profile-body">

        {/* ── AVATAR + NAME CARD ── */}
        <div className="profile-hero-card">
          <div className="avatar-circle" style={{ background: profile?.avatar_color || '#7a9e7e' }}>
            {initials}
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-name">{profile?.full_name || profile?.username}</h1>
            <p className="profile-email">{profile?.email}</p>
            {profile?.fitness_goal && (
              <span className="profile-goal-badge">🎯 {profile.fitness_goal}</span>
            )}
            {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
          </div>
          <div className="profile-quick-stats">
            <div className="qs-item">
              <span className="qs-num">{totalSess}</span>
              <span className="qs-label">Sessions</span>
            </div>
            <div className="qs-divider" />
            <div className="qs-item">
              <span className="qs-num">{Math.round(totalSec / 60)}m</span>
              <span className="qs-label">Total Time</span>
            </div>
            <div className="qs-divider" />
            <div className="qs-item">
              <span className="qs-num">{stats.length}</span>
              <span className="qs-label">Poses Done</span>
            </div>
          </div>
        </div>

        {isEditing ? (
          /* ─────────── EDIT FORM ─────────── */
          <div className="profile-edit-card">
            <h2 className="section-heading">Edit Profile</h2>

            {error   && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSave} className="profile-form">
              {/* Avatar color */}
              <div className="field">
                <label>Avatar Color</label>
                <div className="color-picker">
                  {AVATAR_COLORS.map(c => (
                    <button key={c} type="button"
                      className={`color-dot ${form.avatar_color === c ? 'selected' : ''}`}
                      style={{ background: c }}
                      onClick={() => setForm(f => ({ ...f, avatar_color: c }))}
                    />
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Full Name</label>
                  <input name="full_name" placeholder="Your full name" value={form.full_name} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Age</label>
                  <input name="age" type="number" min="5" max="120" placeholder="25" value={form.age} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    {['Male','Female','Other','Prefer not to say'].map(g => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Fitness Goal</label>
                  <select name="fitness_goal" value={form.fitness_goal} onChange={handleChange}>
                    <option value="">Select a goal…</option>
                    {GOALS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Height (cm)</label>
                  <input name="height_cm" type="number" min="50" max="250" placeholder="170" value={form.height_cm} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Weight (kg)</label>
                  <input name="weight_kg" type="number" min="10" max="300" placeholder="65" value={form.weight_kg} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label>Bio</label>
                <textarea name="bio" rows={3} placeholder="Tell us about yourself…"
                  value={form.bio} onChange={handleChange} />
              </div>

              <button type="submit" className="auth-btn" disabled={saving} style={{ marginTop:8 }}>
                {saving ? <span className="auth-spinner" /> : '💾 Save Profile'}
              </button>
            </form>
          </div>

        ) : (
          /* ─────────── VIEW MODE ─────────── */
          <div className="profile-view-grid">

            {/* Personal Info */}
            <div className="pv-card">
              <h3 className="pv-title">Personal Info</h3>
              <div className="pv-rows">
                {[
                  ['👤 Full Name',   profile?.full_name  || '—'],
                  ['🎂 Age',         profile?.age        ? `${profile.age} years` : '—'],
                  ['⚥ Gender',       profile?.gender     || '—'],
                  ['📏 Height',      profile?.height_cm  ? `${profile.height_cm} cm` : '—'],
                  ['⚖️ Weight',      profile?.weight_kg  ? `${profile.weight_kg} kg` : '—'],
                  ['🎯 Goal',        profile?.fitness_goal || '—'],
                  ['📅 Member since', profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'],
                ].map(([label, value]) => (
                  <div className="pv-row" key={label}>
                    <span className="pv-label">{label}</span>
                    <span className="pv-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pose Stats */}
            <div className="pv-card">
              <h3 className="pv-title">Pose Statistics</h3>
              {stats.length === 0 ? (
                <div className="pv-empty">No sessions yet. <Link to="/start">Start practicing!</Link></div>
              ) : (
                <div className="pose-stats-list">
                  {stats.map(s => (
                    <div className="ps-row" key={s.pose_name}>
                      <div className="ps-name">{s.pose_name}</div>
                      <div className="ps-meta">
                        <span className="ps-badge ps-sessions">{s.total_sessions}× sessions</span>
                        <span className="ps-badge ps-time">{Math.round(s.total_time_sec)}s total</span>
                        <span className="ps-badge ps-best">🏆 {Math.round(s.personal_best_sec)}s best</span>
                      </div>
                      <div className="ps-bar-wrap">
                        <div className="ps-bar" style={{
                          width: `${Math.min(100, (s.total_time_sec / Math.max(...stats.map(x => x.total_time_sec))) * 100)}%`
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="pv-card pv-full">
              <h3 className="pv-title">Recent Sessions</h3>
              {sessions.length === 0 ? (
                <div className="pv-empty">No sessions recorded yet.</div>
              ) : (
                <div className="sessions-table-wrap">
                  <table className="sessions-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Pose</th>
                        <th>Duration</th>
                        <th>Best</th>
                        <th>Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s, i) => (
                        <tr key={s.id}>
                          <td>{i + 1}</td>
                          <td><span className="table-pose">{s.pose_name}</span></td>
                          <td>{Math.round(s.duration_sec)}s</td>
                          <td>🏆 {Math.round(s.best_sec)}s</td>
                          <td>{new Date(s.practiced_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
