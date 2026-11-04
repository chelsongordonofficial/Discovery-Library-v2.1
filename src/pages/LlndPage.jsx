import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import { SITE_URLS } from '../data/urls';

const LLND_PILLARS = [
  {
    title: 'Language & Grammar',
    icon: 'book',
    desc: 'Structuring academic sentences, using vocational terminology accurately, active vs passive voice, and avoiding colloquialisms.',
    resources: ['Report Sentence Starters', 'Glossary of VET Action Verbs', 'Common Australian Spelling Guide'],
  },
  {
    title: 'Literacy & Reading',
    icon: 'newspaper',
    desc: 'Techniques for skimming and scanning complex industry guidelines, extracting key regulations, and synthesizing source texts.',
    resources: ['Active Reading Techniques', 'How to Deconstruct Rubrics', 'Annotated Bibliography Guide'],
  },
  {
    title: 'Numeracy & Math',
    icon: 'listCheck',
    desc: 'Formulas, unit conversions, medication dosages, commercial kitchen ratios, construction tolerances, and assessment math.',
    resources: ['Metric Conversion Tables', 'Percentages & Ratios Guide', 'Chart Interpretation Checklist'],
  },
  {
    title: 'Digital Skills',
    icon: 'play',
    desc: 'Navigating LMS portals (Moodle), uploading assignments, managing Word styles, digital security, and cloud storage.',
    resources: ['Microsoft Word Masterclass', 'PDF Merging Tutorial', 'Verifying USI Transcripts'],
  },
];

export default function LlndPage() {
  return (
    <div className="page page-llnd" style={{ paddingTop: 36, paddingBottom: 100 }}>
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
            Learning & Language <span className="hl-word hl-em">Support</span>
          </h2>
          <p>
            Tailored guidance to strengthen foundational literacy, numeracy, and digital software skills for vocational study.
          </p>
        </Reveal>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 44 }}>
          {LLND_PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="rcard glass c-em" style={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span className="ico"><Icon name={p.icon} /></span>
                <h3 style={{ fontSize: 19, marginBottom: 8, color: 'var(--cream)', fontWeight: 600 }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--sub)', marginBottom: 16, flex: 1, lineHeight: 1.5 }}>{p.desc}</p>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <small style={{ color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 8, fontSize: 12 }}>Key Guides:</small>
                  <ul style={{ fontSize: 12.5, color: '#cfe3d8', display: 'grid', gap: 6 }}>
                    {p.resources.map((r) => (
                      <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--em)' }}>•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Support Consultation Card */}
        <Reveal className="glass panel" style={{ padding: '36px 32px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, color: 'var(--cream)', marginBottom: 10, fontWeight: 600 }}>
              Need One-on-One Learning Confidence Mentoring?
            </h3>
            <p style={{ color: 'var(--sub)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 24 }}>
              If you feel unsure about assessment math calculations or drafting reports, our academic coaches are available for confidential support sessions.
            </p>
            <SpecularButton
              as={Link}
              to={SITE_URLS.contact}
              className="btn btn-gold btn-lg"
              radius={12}
            >
              Book an Academic Consultation
            </SpecularButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
