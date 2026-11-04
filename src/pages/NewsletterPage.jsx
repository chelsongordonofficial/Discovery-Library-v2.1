import { useState, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import { useWpData } from '../context/WpContext';

const FALLBACK_NEWSLETTERS = [
  {
    issue: 'Issue 42 — October 2026',
    title: 'Navigating New ASQA Evidence Standards & AI in Capstone Projects',
    date: 'October 15, 2026',
    summary: 'A look into the revised TAE and vocational assessment guidelines, how trainers can verify evidence authenticity, and new generative AI referencing requirements under APA 7th.',
    readTime: '6 min read',
    tags: ['ASQA Standards', 'AI Policies', 'Library Update'],
  },
  {
    issue: 'Issue 41 — September 2026',
    title: 'Digital Literacies in 2026: Beyond Basic Word Processing',
    date: 'September 12, 2026',
    summary: 'Introducing the 11-lesson Microsoft Word Masterclass on Discovery Library. Plus: Top academic databases accessible to every vocational learner without paid paywalls.',
    readTime: '5 min read',
    tags: ['MS Word Series', 'Student Tools', 'VOCEDplus'],
  },
  {
    issue: 'Issue 40 — August 2026',
    title: 'Academic Momentum: Staying on Track During Rolling Intakes',
    date: 'August 18, 2026',
    summary: 'Proven strategies for students balancing work commitments with vocational certificates. Discover how one-on-one LLND support sessions boost course completion rates.',
    readTime: '4 min read',
    tags: ['LLND Support', 'Study Strategies', 'Campus Life'],
  },
];

export default function NewsletterPage({ onNotify }) {
  const { newsletters } = useWpData();
  const [subEmail, setSubEmail] = useState('');

  const displayNewsletters = useMemo(() => {
    if (newsletters && newsletters.length > 0) {
      return newsletters.map((n, idx) => ({
        issue: `Issue WP-${n.id || idx + 1}`,
        title: n.title,
        date: n.date || 'Recent Issue',
        summary: 'Official newsletter publication from Discovery Library academic support team.',
        readTime: '5 min read',
        tags: ['Library Dispatch'],
        pdf_url: n.pdf_url,
        isWp: true,
      }));
    }
    return FALLBACK_NEWSLETTERS;
  }, [newsletters]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    if (onNotify) onNotify(`Thank you! ${subEmail} has been subscribed to Discovery Herald.`);
    setSubEmail('');
  };

  return (
    <div className="page page-newsletter" style={{ paddingTop: 36, paddingBottom: 100 }}>
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

        {/* Section Header with Disciplined Typography */}
        <Reveal className="sh">
          <h2>
            The Discovery <span className="hl-word hl-gold">Herald</span>
          </h2>
          <p>
            Monthly updates, academic writing advice, VET sector updates, and announcements from the library team.
          </p>
        </Reveal>

        {/* Subscribe banner */}
        <Reveal className="glass panel" style={{ marginBottom: 36, padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: 18.5, marginBottom: 4, color: 'var(--cream)', fontWeight: 600 }}>
                Subscribe to The Discovery Herald
              </h3>
              <p style={{ color: 'var(--sub)', fontSize: 14, margin: 0 }}>
                Get referencing updates and workshop schedules delivered directly to your student email.
              </p>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div className="sbox" style={{ margin: 0, minWidth: 260 }}>
                <Icon name="newspaper" />
                <input
                  type="email"
                  required
                  placeholder="Enter your student email..."
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                />
              </div>
              <SpecularButton type="submit" className="btn btn-gold" radius={10}>
                Subscribe
              </SpecularButton>
            </form>
          </div>
        </Reveal>

        {/* Newsletter list */}
        <div style={{ display: 'grid', gap: 16 }}>
          {displayNewsletters.map((n, i) => (
            <Reveal key={n.issue || i} delay={i * 0.06}>
              <div
                className="glass panel"
                style={{
                  padding: '22px 26px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 20,
                  alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="typetag">{n.issue}</span>
                    <span style={{ fontSize: 13, color: 'var(--sub)' }}>{n.date} · {n.readTime}</span>
                  </div>

                  <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--cream)', fontWeight: 600 }}>
                    {n.title}
                  </h3>

                  <p style={{ color: 'var(--sub)', fontSize: 14, lineHeight: 1.55, marginBottom: 12, maxWidth: 840 }}>
                    {n.summary}
                  </p>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {n.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 12,
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--line)',
                          padding: '2px 9px',
                          borderRadius: 100,
                          color: 'var(--sub)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <RippleButton
                    as="button"
                    type="button"
                    onClick={() => {
                      if (n.pdf_url) window.open(n.pdf_url, '_blank', 'noopener,noreferrer');
                      else if (onNotify) onNotify(`Opening ${n.issue}`);
                    }}
                    className="btn btn-ghost btn-sm"
                    rippleColor="var(--em)"
                  >
                    Read Issue <Icon name="arrow" style={{ width: 14, height: 14 }} />
                  </RippleButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
