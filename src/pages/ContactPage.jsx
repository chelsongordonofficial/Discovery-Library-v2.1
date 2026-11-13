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
            
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Contact
            </GradientText>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}> Us</span>{' '}
          </h2>
          <p>
            Connect with our library staff by submitting an inquiry online.
          </p>
        </Reveal>

        {/* 2-Column Contact Form & FAQs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
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
            </div>
          </Reveal>

          {/* FAQs Section */}
          <div style={{ display: 'grid', gap: 12, textAlign: 'left' }}>
            <Reveal style={{ marginBottom: 6 }}>
              <h3 style={{ fontSize: 22, margin: '0 0 6px', color: 'var(--cream)', fontWeight: 700 }}>
                Frequently Asked <span className="hl-word hl-em">Questions</span>
              </h3>
              <p style={{ color: 'var(--sub)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                Quick answers to common library and assessment questions.
              </p>
            </Reveal>

            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal key={faq.q} delay={idx * 0.04}>
                  <div
                    className="glass panel"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    style={{
                      padding: '18px 22px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderColor: isOpen ? 'rgba(255, 200, 58, 0.35)' : undefined,
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpenFaq(isOpen ? null : idx);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <h4 style={{ fontSize: 15.5, margin: 0, color: 'var(--cream)', fontWeight: 600 }}>
                        {faq.q}
                      </h4>
                      <span
                        style={{
                          color: 'var(--gold)',
                          fontSize: 18,
                          flexShrink: 0,
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.36s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                      >
                        ▾
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        opacity: isOpen ? 1 : 0,
                        transition: 'grid-template-rows 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease',
                      }}
                    >
                      <div style={{ overflow: 'hidden', minHeight: 0 }}>
                        <p
                          style={{
                            marginTop: 12,
                            marginBottom: 0,
                            fontSize: 14,
                            color: 'var(--sub)',
                            lineHeight: 1.55,
                            transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                            transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
