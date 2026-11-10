import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import GradientText from '../components/ui/GradientText';

const CAMPUS_LOCATIONS = [
  { city: 'Brisbane', address: 'Level 2, 288 Edward Street, Brisbane QLD 4000', hours: 'Mon–Fri: 8:00 AM – 6:00 PM', email: 'library.bne@aibtglobal.edu.au' },
  { city: 'Sydney', address: 'Level 1, 460 Church Street, Parramatta NSW 2150', hours: 'Mon–Fri: 8:00 AM – 6:00 PM', email: 'library.syd@aibtglobal.edu.au' },
  { city: 'Melbourne', address: 'Level 3, 277 Flinders Lane, Melbourne VIC 3000', hours: 'Mon–Fri: 8:30 AM – 5:30 PM', email: 'library.mel@aibtglobal.edu.au' },
  { city: 'Adelaide', address: 'Level 1, 90 King William Street, Adelaide SA 5000', hours: 'Mon–Fri: 9:00 AM – 5:00 PM', email: 'library.adl@aibtglobal.edu.au' },
  { city: 'Hobart', address: 'Suite 4, 111 Macquarie Street, Hobart TAS 7000', hours: 'Mon–Fri: 9:00 AM – 5:00 PM', email: 'library.hba@aibtglobal.edu.au' },
];

const FAQS = [
  {
    q: 'How do I access peer-reviewed journals for free?',
    a: 'Vocational students have free access to VOCEDplus, Google Scholar, ERIC, and DOAJ via the Resources page. No paywalls or external subscriptions are required.',
  },
  {
    q: 'Can I use generative AI (e.g. ChatGPT) for my assessments?',
    a: 'AI may be used as an exploratory research assistant or for brainstorming, but cannot write assessment answers. Any AI ideas must be disclosed with prompts and cited under APA 7th standards.',
  },
  {
    q: 'How do I download session slides or recordings?',
    a: 'Visit the Sessions page and switch to Session Recordings. Each event provides direct links to streaming video archives and downloadable companion slides.',
  },
  {
    q: 'Are library consultations completely free?',
    a: 'Yes, 100% free of charge for all enrolled vocational students across certificate, diploma, and advanced diploma qualifications.',
  },
];

import { useGravityFormMount } from '../services/gravityFormHandler';

export default function ContactPage({ onNotify }) {
  const [openFaq, setOpenFaq] = useState(null);

  useGravityFormMount('gravity-form-mount', () => {
    if (onNotify) onNotify('Consultation request received! Thank you.');
  });

  return (
    <div className="page page-contact" style={{ paddingTop: 36, paddingBottom: 100 }}>
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
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Contact Us & Campus</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Hubs
            </GradientText>
          </h2>
          <p>
            Connect with our library staff in person at any campus location or submit an inquiry online.
          </p>
        </Reveal>

        {/* 2-Column Contact Form & Campus Hubs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
          {/* Gravity Form Mount Section */}
          <Reveal className="glass panel gform-mount-container" style={{ padding: '28px 30px', textAlign: 'left' }}>
            <div className="gform-mount-header" style={{ marginBottom: 22 }}>
              <h3 style={{ fontSize: 20, marginBottom: 8, color: 'var(--cream)', fontWeight: 600 }}>
                Book a Consultation or Send an Enquiry
              </h3>
              <p style={{ color: 'var(--sub)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                Need help with APA 7th referencing, locating research journal papers, or navigating Moodle? Submit your enquiry below.
              </p>
            </div>

            {/* Designated Mount Container for WordPress Gravity Forms */}
            <div
              id="gravity-form-mount"
              className="gravity-form-mount-target"
              data-gform-mount="true"
            >
              {/* Ready placeholder target — automatically concealed when Gravity Forms is rendered by WordPress */}
              <div className="gform-mount-placeholder">
                <div className="gf-placeholder-icon">
                  <Icon name="mail" />
                </div>
                <div className="gf-placeholder-title">
                  Gravity Form Mount Container
                </div>
                <p className="gf-placeholder-text">
                  Target container configured for WordPress Gravity Forms. All fields, labels, inputs, validations, and submission buttons inherit the Discovery Library theme.
                </p>
                <code className="gf-placeholder-code">
                  #gravity-form-mount
                </code>
              </div>
            </div>
          </Reveal>

          {/* Campus Locations */}
          <div style={{ display: 'grid', gap: 14 }}>
            {CAMPUS_LOCATIONS.map((loc, i) => (
              <Reveal key={loc.city} delay={i * 0.05}>
                <div className="glass panel" style={{ padding: '18px 22px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 16.5, margin: 0, color: 'var(--cream)', fontWeight: 600 }}>
                      {loc.city} Campus Library
                    </h4>
                    <span style={{ fontSize: 12, color: 'var(--em)' }}>{loc.hours}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--sub)', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {loc.address}
                  </p>
                  <a href={`mailto:${loc.email}`} style={{ fontSize: 13, color: 'var(--gold)', textDecoration: 'none' }}>
                    {loc.email}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <Reveal className="sh" style={{ marginBottom: 20 }}>
          <h2>
            Frequently Asked <span className="hl-word hl-em">Questions</span>
          </h2>
        </Reveal>

        <div style={{ maxWidth: 840, margin: '0 auto', display: 'grid', gap: 12 }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Reveal key={faq.q} delay={idx * 0.04}>
                <div
                  className="glass panel"
                  style={{
                    padding: '18px 24px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 16, margin: 0, color: 'var(--cream)', fontWeight: 600 }}>
                      {faq.q}
                    </h4>
                    <span style={{ color: 'var(--gold)', fontSize: 18, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      ▾
                    </span>
                  </div>
                  {isOpen && (
                    <p style={{ marginTop: 12, fontSize: 14, color: 'var(--sub)', lineHeight: 1.55 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
