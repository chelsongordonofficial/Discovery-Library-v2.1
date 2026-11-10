import { useState, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import GradientText from '../components/ui/GradientText';
import { useWpData } from '../context/WpContext';
import { SITE_URLS } from '../data/urls';

const FALLBACK_DIRECTORY = [
  {
    category: 'Academic Search & Research Databases',
    items: [
      {
        name: 'VOCEDplus',
        desc: 'The National Centre for Vocational Education Research (NCVER) free international research database for VET.',
        url: 'https://www.voced.edu.au',
        tag: 'VET Research',
        icon: 'book',
      },
      {
        name: 'Google Scholar',
        desc: 'Freely accessible search engine indexing full text or metadata of scholarly literature across disciplines.',
        url: 'https://scholar.google.com',
        tag: 'General Academic',
        icon: 'search',
      },
      {
        name: 'ERIC (Education Resources Info Center)',
        desc: 'Comprehensive online library of education research and information sponsored by the Institute of Education Sciences.',
        url: 'https://eric.ed.gov',
        tag: 'Education',
        icon: 'book',
      },
      {
        name: 'Trove (National Library of Australia)',
        desc: 'Discover Australian research papers, historical archives, government gazettes, and published texts.',
        url: 'https://trove.nla.gov.au',
        tag: 'Australian Archives',
        icon: 'link',
      },
    ],
  },
  {
    category: 'VET Standards & Compliance Portals',
    items: [
      {
        name: 'training.gov.au (TGA)',
        desc: 'The official national register of information on Training Packages, Qualifications, Courses, and RTOs.',
        url: 'https://training.gov.au',
        tag: 'Official Register',
        icon: 'listCheck',
      },
      {
        name: 'ASQA (Australian Skills Quality Authority)',
        desc: 'National regulator for Australia’s vocational education and training sector, providing standards and student guides.',
        url: 'https://www.asqa.gov.au',
        tag: 'Regulatory',
        icon: 'lock',
      },
      {
        name: 'Unique Student Identifier (USI)',
        desc: 'Access your authenticated USI transcript and verify vocational training records across providers.',
        url: 'https://www.usi.gov.au',
        tag: 'Government Portal',
        icon: 'lock',
      },
    ],
  },
  {
    category: 'Academic Writing & Study Tools',
    items: [
      {
        name: 'APA Style Official Guidelines (7th Edition)',
        desc: 'Official formatting rules, in-text citations, and reference list sample papers from the American Psychological Association.',
        url: 'https://apastyle.apa.org',
        tag: 'Referencing',
        icon: 'listCheck',
      },
      {
        name: 'Purdue OWL (Online Writing Lab)',
        desc: 'Globally recognized guide on academic writing rhetoric, paragraph organization, and mechanics.',
        url: 'https://owl.purdue.edu',
        tag: 'Writing Lab',
        icon: 'book',
      },
    ],
  },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Resources' },
  { id: 'search', label: 'Databases' },
  { id: 'standards', label: 'VET Registers' },
  { id: 'writing', label: 'Writing & Citation' },
];

export default function UsefulLinksPage({ onNotify }) {
  const { usefulLinks } = useWpData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const directoryData = useMemo(() => {
    // Live data Priority 1: If live WordPress links exist, return ONLY live items
    if (usefulLinks && usefulLinks.length > 0) {
      return [
        {
          category: 'Useful Links & Videos',
          items: usefulLinks.map((item) => ({
            name: item.title,
            desc: item.desc || 'Curated link and instructional media from Discovery Library.',
            url: item.url,
            tag: item.tag || 'Official Resource',
            icon: 'link',
          })),
        },
      ];
    }

    // Fallback data: Shown strictly when REST endpoint is unreachable or empty
    return FALLBACK_DIRECTORY;
  }, [usefulLinks]);

  const filteredCategories = useMemo(() => {
    return directoryData
      .map((cat) => {
        const matchesCategory =
          activeTab === 'all' ||
          cat.category.toLowerCase().includes(activeTab) ||
          (activeTab === 'search' && cat.category.toLowerCase().includes('database')) ||
          (activeTab === 'standards' && cat.category.toLowerCase().includes('vet')) ||
          (activeTab === 'writing' && cat.category.toLowerCase().includes('writing'));

        if (!matchesCategory) return null;

        const filteredItems = cat.items.filter((item) => {
          if (!searchTerm) return true;
          const q = searchTerm.toLowerCase();
          return (
            item.name.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.tag.toLowerCase().includes(q)
          );
        });

        if (filteredItems.length === 0) return null;
        return { ...cat, items: filteredItems };
      })
      .filter(Boolean);
  }, [directoryData, activeTab, searchTerm]);

  return (
    <div className="page page-links" style={{ paddingTop: 36, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Clean Back Button - No random pill */}
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <RippleButton
            as={Link}
            to={SITE_URLS.resources}
            className="btn btn-ghost btn-sm"
            rippleColor="var(--em)"
          >
            <Icon name="arrowLeft" />
            Back to Resources
          </RippleButton>
        </div>

        {/* Section Header with Disciplined Typography */}
        <Reveal className="sh">
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Useful</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Links & Videos
            </GradientText>
          </h2>
          <p>
            Authoritative registers, research databases, and style manuals for vocational learners and trainers.
          </p>
        </Reveal>

        {/* Clean Search and Filter Controls in a Single Row */}
        <Reveal className="glass panel" style={{ marginBottom: 36, padding: '16px 20px' }}>
          <div className="filter-bar">
            <div className="sbox">
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search resources, registers, or guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              {FILTER_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`filter-tab${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Directory Grid */}
        <div style={{ display: 'grid', gap: 32 }}>
          {filteredCategories.length === 0 ? (
            <div className="glass panel" style={{ padding: 36, textAlign: 'center', color: 'var(--sub)' }}>
              No resources match your search or filter criteria.
            </div>
          ) : (
            filteredCategories.map((group, groupIdx) => (
              <Reveal key={group.category} delay={groupIdx * 0.05}>
                <div style={{ textAlign: 'left', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 19, color: 'var(--cream)', fontWeight: 600 }}>
                    {group.category}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {group.items.map((item, idx) => (
                    <div
                      key={item.name + idx}
                      className="glass panel"
                      style={{
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'left',
                        height: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span className="typetag">{item.tag}</span>
                        <Icon name={item.icon || 'link'} className="gold" style={{ width: 18, height: 18 }} />
                      </div>

                      <h4 style={{ fontSize: 16.5, marginBottom: 8, color: 'var(--cream)', fontWeight: 600 }}>
                        {item.name}
                      </h4>

                      <p style={{ fontSize: 13.5, color: 'var(--sub)', flexGrow: 1, marginBottom: 16, lineHeight: 1.5 }}>
                        {item.desc}
                      </p>

                      <div style={{ marginTop: 'auto' }}>
                        <SpecularButton
                          as="a"
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-gold btn-sm"
                          radius={10}
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => {
                            if (onNotify) onNotify(`Opening ${item.name}`);
                          }}
                        >
                          Open Resource <Icon name="arrow" style={{ width: 14, height: 14 }} />
                        </SpecularButton>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
