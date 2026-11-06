import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import GradientText from '../components/ui/GradientText';

const CAMPUSES = [
  'Brisbane Campus Library',
  'Sydney Campus Library',
  'Melbourne Campus Library',
  'Adelaide Campus Library',
  'Hobart Campus Library',
  'Online Virtual Consultation (Zoom)',
];

const CONSULT_TOPICS = [
  'APA 7th Referencing & Citation Review',
  'Assessment Research & Sourcing Credible Data',
  'Report Structure & Assignment Formatting',
  'Numeracy & Practical Calculations Tutoring',
  'LLND Skill Building & Confidence Coaching',
  'Trainer & Assessor Evidence Strategies (TAE)',
];

const TIME_SLOTS = [
  '09:30 AM - 10:15 AM',
  '11:00 AM - 11:45 AM',
  '01:30 PM - 02:15 PM',
  '03:00 PM - 03:45 PM',
  '04:30 PM - 05:15 PM',
];

export default function ConsultationPage({ onNotify }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    campus: CAMPUSES[0],
    topic: CONSULT_TOPICS[0],
    date: '2026-11-02',
    timeSlot: TIME_SLOTS[1],
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
    if (onNotify) {
      onNotify(`Consultation booked successfully for ${formData.name}! Details sent to ${formData.email}.`);
    }
  };

  return (
    <div className="page page-consultation" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Clean Back Button - No random pill */}
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <RippleButton
            as={Link}
            to="/"
            className="btn btn-ghost btn-sm"
            rippleColor="var(--em)"
          >
            <Icon name="arrowLeft" />
            Back to Home
          </RippleButton>
        </div>

        <Reveal className="sh">
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Book a One-on-One</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Consultation
            </GradientText>
          </h2>
          <p>
            Get dedicated 1-on-1 guidance with our qualified librarians and learning mentors. Available in person across all five campuses or online via Zoom.
          </p>
        </Reveal>

        {submitted ? (
          <Reveal className="glass panel" style={{ maxWidth: 680, margin: '40px auto', textAlign: 'center', padding: '50px 36px' }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #46F2AA, #12B877)',
                color: '#01160e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 32,
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: 26, marginBottom: 10 }}>Consultation Booked!</h3>
            <p style={{ fontSize: 15, color: 'var(--sub)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 24px' }}>
              We have scheduled your session with an academic mentor. A calendar invitation and confirmation receipt has been sent to <strong>{formData.email}</strong>.
            </p>

            <div style={{ background: 'rgba(2,14,9,0.7)', borderRadius: 14, padding: 20, textAlign: 'left', maxWidth: 460, margin: '0 auto 28px', border: '1px solid var(--line-gold)' }}>
              <div style={{ display: 'grid', gap: 10, fontSize: 13.5 }}>
                <div><strong>Student:</strong> {formData.name} ({formData.studentId || 'N/A'})</div>
                <div><strong>Focus Topic:</strong> {formData.topic}</div>
                <div><strong>Campus / Venue:</strong> {formData.campus}</div>
                <div><strong>Scheduled Date:</strong> {formData.date} at {formData.timeSlot}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSubmitted(false)}
              >
                Book Another Session
              </button>
              <Link to="/" className="btn btn-gold">
                Return to Library Home
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="split" style={{ alignItems: 'start' }}>
            {/* Booking Form */}
            <Reveal className="glass panel" style={{ padding: '36px 32px' }}>
              <h3 style={{ fontSize: 22, marginBottom: 20 }}>Appointment Details</h3>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Full Name *</label>
                    <div className="sbox">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ paddingLeft: 14 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Student Email *</label>
                    <div className="sbox">
                      <input
                        type="email"
                        required
                        placeholder="s.jenkins@aibtglobal.edu.au"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ paddingLeft: 14 }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Student ID (Optional)</label>
                    <div className="sbox">
                      <input
                        type="text"
                        placeholder="e.g. AIBT202688"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        style={{ paddingLeft: 14 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Campus Location</label>
                    <select
                      value={formData.campus}
                      onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(2,14,9,0.7)',
                        border: '1px solid var(--line)',
                        borderRadius: 11,
                        padding: '11px 14px',
                        color: 'var(--cream)',
                        font: '500 14px var(--f-body)',
                      }}
                    >
                      {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Consultation Focus Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(2,14,9,0.7)',
                      border: '1px solid var(--line)',
                      borderRadius: 11,
                      padding: '11px 14px',
                      color: 'var(--cream)',
                      font: '500 14px var(--f-body)',
                    }}
                  >
                    {CONSULT_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Preferred Date</label>
                    <div className="sbox">
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        style={{ paddingLeft: 14, colorScheme: 'dark' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Preferred Time Slot</label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(2,14,9,0.7)',
                        border: '1px solid var(--line)',
                        borderRadius: 11,
                        padding: '11px 14px',
                        color: 'var(--cream)',
                        font: '500 14px var(--f-body)',
                      }}
                    >
                      {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Specific Unit or Assignment Questions (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the assessment task, unit code, or specific referencing questions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(2,14,9,0.7)',
                      border: '1px solid var(--line)',
                      borderRadius: 11,
                      padding: '11px 14px',
                      color: 'var(--cream)',
                      font: '500 14px var(--f-body)',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-gold btn-lg" style={{ justifyContent: 'center', marginTop: 8 }}>
                  Book 45-Minute Consultation
                </button>
              </form>
            </Reveal>

            {/* Sidebar Information */}
            <div style={{ display: 'grid', gap: 20 }}>
              <Reveal className="glass panel" delay={0.1}>
                <h4 style={{ fontSize: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="calendar" className="gold" /> Consultation Highlights
                </h4>
                <ul style={{ display: 'grid', gap: 10, fontSize: 13.5, color: 'var(--sub)' }}>
                  <li style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--em)' }}>•</span> 100% free for enrolled students and vocational staff.
                  </li>
                  <li style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--em)' }}>•</span> Up to two 45-minute sessions per week per student.
                  </li>
                  <li style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--em)' }}>•</span> Bring draft assignments, rubrics, or referencing questions.
                  </li>
                  <li style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--em)' }}>•</span> In-person or Zoom with screen sharing & collaborative notes.
                  </li>
                </ul>
              </Reveal>

              <Reveal className="glass panel" delay={0.15}>
                <h4 style={{ fontSize: 18, marginBottom: 10 }}>Immediate Referencing Help</h4>
                <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5, marginBottom: 14 }}>
                  Need an answer immediately before submission? Use our interactive APA 7th guide with instant generator.
                </p>
                <Link to="/referencing" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                  Open Referencing Guide
                </Link>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
