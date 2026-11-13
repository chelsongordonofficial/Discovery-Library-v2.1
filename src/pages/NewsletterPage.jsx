import { useState, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import RippleButton from '../components/ui/RippleButton';
import SpecularButton from '../components/ui/SpecularButton';
import GradientText from '../components/ui/GradientText';
import { useWpData } from '../context/WpContext';
import { parseNewsletterDate } from '../services/wpApi';

const FALLBACK_NEWSLETTERS = [
  {
    id: 'fb-2026-10',
    month: 'October',
    year: '2026',
    title: 'Navigating New ASQA Evidence Standards & AI in Capstone Projects',
    pdf_url: '',
  },
  {
    id: 'fb-2026-09',
    month: 'September',
    year: '2026',
    title: 'Digital Literacies in 2026: Beyond Basic Word Processing',
    pdf_url: '',
  },
  {
    id: 'fb-2026-08',
    month: 'August',
    year: '2026',
    title: 'Academic Momentum: Staying on Track During Rolling Intakes',
    pdf_url: '',
  },
  {
    id: 'fb-2025-11',
    month: 'November',
    year: '2025',
    title: 'End-of-Year Referencing Checklist & APA 7th Quick Reminders',
    pdf_url: '',
  },
  {
    id: 'fb-2025-07',
    month: 'July',
    year: '2025',
    title: 'Open-Access Research Databases for Vocational Learners',
    pdf_url: '',
  },
];

const DEFAULT_YEARS = ['2026', '2025'];

function buildDownloadFilename(item) {
  const base = [item.month, item.year, item.title]
    .filter(Boolean)
    .join(' - ')
    .replace(/[^a-z0-9\s\-_]/gi, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${base || 'Discovery-Library-Newsletter'}.pdf`;
}

export default function NewsletterPage({ onNotify }) {
  const { newsletters, isNewslettersLive, isInitialLoading } = useWpData();
  const [selectedYear, setSelectedYear] = useState('2026');
  const [downloadingId, setDownloadingId] = useState(null);

  const processedNewsletters = useMemo(() => {
    if (newsletters && newsletters.length > 0) {
      return newsletters.map((n, idx) => {
        const parsed = (!n.month || !n.year) ? parseNewsletterDate(n.date) : null;
        return {
          id: n.id || `wp-${idx}`,
          month: n.show_newsletter_date === false ? '' : (n.month || parsed?.month || ''),
          year: String(n.year || parsed?.year || '2026'),
          title: n.title || 'Discovery Library Newsletter',
          file_url: n.file_url || n.pdf_url || '',
          pdf_url: n.pdf_url || n.file_url || n.link || '',
          show_file_url: n.show_file_url !== false,
          sortTime: n.sortTime || parsed?.sortTime || 0,
        };
      });
    }

    if (isNewslettersLive) {
      return [];
    }

    return FALLBACK_NEWSLETTERS;
  }, [newsletters, isNewslettersLive]);

  const yearPills = useMemo(() => {
    const wpYears = processedNewsletters.map((n) => String(n.year)).filter(Boolean);
    return [...new Set([...DEFAULT_YEARS, ...wpYears])].sort((a, b) => Number(b) - Number(a));
  }, [processedNewsletters]);

  const filteredNewsletters = useMemo(() => {
    return processedNewsletters
      .filter((n) => String(n.year) === String(selectedYear))
      .sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0));
  }, [processedNewsletters, selectedYear]);

  const handleDownload = async (item) => {
    const downloadUrl = item.file_url || item.pdf_url;
    if (!downloadUrl) {
      if (onNotify) onNotify('Download file is not available for this newsletter yet.');
      return;
    }

    const fileName = buildDownloadFilename(item);
    setDownloadingId(item.id);

    try {
      const response = await fetch(downloadUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Direct blob download unavailable');
      const rawBlob = await response.blob();
      const downloadBlob = new Blob([rawBlob], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(downloadBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
      if (onNotify) onNotify(`Downloading "${item.title}"`);
    } catch {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (onNotify) onNotify(`Downloading "${item.title}"`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="page page-newsletter" style={{ paddingTop: 36, paddingBottom: 100 }}>
      <div className="wrap">
        {/* Back Button */}
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

        {/* Section Header */}
        <Reveal className="sh" style={{ marginLeft: 0, marginBottom: 24 }}>
          <h2>
            <span style={{ fontFamily: 'var(--f-body)', fontWeight: 600 }}>Our</span>{' '}
            <GradientText
              colors={['#FFC83A', '#FF9E2C', '#FFE17D', '#FF9E2C', '#FFC83A']}
              animationSpeed={5}
              style={{ fontFamily: 'var(--f-head)', fontWeight: 800 }}
            >
              Newsletter
            </GradientText>
          </h2>
          <p>
            Monthly updates, academic writing advice, VET sector updates, and announcements from the library team.
          </p>
        </Reveal>

        {/* Filter by Year Pills */}
        <Reveal style={{ marginBottom: 28 }}>
          <div
            className="filter-group"
            role="tablist"
            aria-label="Filter newsletters by year"
            style={{ justifyContent: 'flex-start' }}
          >
            {yearPills.map((year) => {
              const isActive = String(selectedYear) === String(year);
              return (
                <button
                  key={year}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`filter-tab${isActive ? ' active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Newsletter Rows */}
        {isInitialLoading && (!newsletters || newsletters.length === 0) ? (
          <div className="glass panel" style={{ padding: 36, textAlign: 'center', color: 'var(--sub)' }}>
            Loading newsletters...
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <Reveal className="glass panel" style={{ padding: 36, textAlign: 'center', color: 'var(--sub)' }}>
            No newsletters available for {selectedYear} yet.
          </Reveal>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {filteredNewsletters.map((n, i) => {
              const previewUrl = n.pdf_url || n.file_url;
              const isDownloading = downloadingId === n.id;

              return (
                <Reveal key={n.id || i} delay={i * 0.05}>
                  <div
                    className="glass panel"
                    style={{
                      padding: '22px 26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 20,
                      flexWrap: 'wrap',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                      {n.month && (
                        <div
                          style={{
                            fontFamily: 'var(--f-mono)',
                            fontSize: 15,
                            fontWeight: 700,
                            letterSpacing: '0.07em',
                            textTransform: 'uppercase',
                            color: 'var(--em)',
                            marginBottom: 8,
                          }}
                        >
                          {n.month}
                        </div>
                      )}

                      <h3
                        style={{
                          fontSize: 18,
                          margin: 0,
                          color: 'var(--cream)',
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {n.title}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flexShrink: 0 }}>
                      <RippleButton
                        as="button"
                        type="button"
                        onClick={() => handleDownload(n)}
                        disabled={isDownloading}
                        className="btn btn-ghost"
                        rippleColor="var(--em)"
                        style={{ padding: '13px 20px' }}
                      >
                        <Icon name="download" style={{ width: 18, height: 18 }} />
                        {isDownloading ? 'Downloading...' : 'Download'}
                      </RippleButton>

                      <SpecularButton
                        as="a"
                        href={previewUrl || '#'}
                        target={previewUrl ? '_blank' : undefined}
                        rel={previewUrl ? 'noopener noreferrer' : undefined}
                        onClick={(e) => {
                          if (!previewUrl) {
                            e.preventDefault();
                            if (onNotify) onNotify('Preview file is not available for this newsletter yet.');
                          }
                        }}
                        className="btn btn-gold"
                        radius={12}
                        lineColor="#ffffff"
                        baseColor="#ffd860"
                        intensity={1.2}
                        style={{ padding: '14px 22px' }}
                      >
                        Preview
                        <Icon name="arrow" style={{ width: 16, height: 16 }} />
                      </SpecularButton>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
