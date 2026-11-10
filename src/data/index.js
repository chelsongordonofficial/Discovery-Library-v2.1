const WORD_LESSONS_DATA = [
  {
    id: 1,
    title: 'Opening & Quitting the Program',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
    duration: '04:12',
  },
  {
    id: 2,
    title: 'How to Create a Document, Add & Format Text',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
    duration: '06:45',
  },
  {
    id: 3,
    title: 'Page Formatting',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
    duration: '05:20',
  },
  {
    id: 4,
    title: 'Paragraph Formatting',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
    duration: '05:55',
  },
  {
    id: 5,
    title: 'Word Formatting Styles',
    url: 'https://cdn.vconsultancy.com.au/media/vid/discovery_library/Microsoft%20Word%20Training%20(1).mp4',
    duration: '07:18',
  },
];

const WORD_LESSONS = WORD_LESSONS_DATA.map((l) => l.title);

import { SITE_URLS } from './urls';

const RES_CARDS = [
  { to: SITE_URLS.videos, cls: 'c-em', icon: 'play', t: 'Training Videos', d: 'Curated video lessons on VET compliance, technology, and assessor standards.' },
  { to: SITE_URLS.links, cls: 'c-gold', icon: 'link', t: 'Useful Links & Videos', d: 'Directory of academic search engines, research databases, and style manuals.' },
  { to: SITE_URLS.recordings, cls: 'c-mint', icon: 'record', t: 'Session Recordings', d: 'Catch up on past live clinics, workshops, and compliance briefings anytime.' },
  { to: SITE_URLS.sessions, cls: 'c-amber', icon: 'calendar', t: 'Upcoming Sessions', d: 'Live referencing clinics, numeracy workshops, and ASQA webinars.', isNew: true },
];

const QUICK = [
  {
    k: 'Journal article',
    sectionId: 'articles',
    tabId: '4-1',
    ref: 'Moser, D. V., & Martin, P. R. (2012). A broader perspective on corporate social responsibility research in accounting. The Accounting Review, 87(3), 797–806. https://doi.org/10.2308/accr-10257',
    it: '(Moser & Martin, 2012) — or — “Many large organisations adjusted their routine work after the Global Financial Crisis” (Smith, 2019, p. 1)',
    n: 'Always provide a DOI when available. If unavailable, provide the direct journal homepage URL. Italicise the journal name and volume number.',
  },
  {
    k: 'Webpage',
    sectionId: 'internet',
    tabId: '3-2',
    ref: 'APA Style. (2019). Plagiarism. American Psychological Association. https://apastyle.apa.org/style-grammar-guidelines/citations/plagiarism',
    it: '(APA Style, 2019) — or — “The students must use the library’s reference guides” (Anderson, para. 1)',
    n: 'When personal author is not available, use the organization name. Do not italicise standard webpage titles. Include retrieval date only when content is frequently updated.',
  },
  {
    k: 'Blog post',
    sectionId: 'internet',
    tabId: '3-3',
    ref: 'Morphett, J. (2019, October 22). SEO analytics for free – combining Google search with the Moz API [Web blog post]. https://moz.com/blog/combining-google-search-with-moz-api',
    it: '(Morphett, 2019) — or — Anderson (2019) recommended the library’s reference guides.',
    n: 'Include [Web blog post] in square brackets after the title. For blog comments, use [Blog comment] and cite the thread.',
  },
  {
    k: 'eBook',
    sectionId: 'books',
    tabId: '2-2',
    ref: 'Cabana, D., Rölfer, L., Evadzi, P., & Celliers, L. (2023). Enabling climate change adaptation in coastal systems: A systematic literature review. Earth’s Future, 11, e2023EF003713. https://doi.org/10.1029/2023EF003713',
    it: '(Cabana et al., 2023) — or — “Adaptation strategies must be flexible and responsive to changing climatic conditions” (Klein & Moser, 2021, p. 103)',
    n: 'Always provide the DOI when available. If unavailable, provide the publisher homepage URL.',
  },
];

const NAV_LINKS = [
  { to: SITE_URLS.resources, label: 'Resources', icon: 'book' },
  { to: SITE_URLS.videos, label: 'Training Videos', icon: 'video' },
  { to: SITE_URLS.sessions, label: 'Sessions', icon: 'calendar' },
  { to: SITE_URLS.referencing, label: 'Referencing', icon: 'listCheck' },
  { to: SITE_URLS.newsletter, label: 'Newsletter', icon: 'newspaper' },
];

const MOBILE_LINKS = [
  [SITE_URLS.home, 'Home'],
  [SITE_URLS.resources, 'Resources'],
  [SITE_URLS.videos, 'Training Videos'],
  [SITE_URLS.links, 'Useful Links & Videos'],
  [SITE_URLS.recordings, 'Session Recordings'],
  [SITE_URLS.sessions, 'Sessions'],
  [SITE_URLS.referencing, 'Referencing'],
  [SITE_URLS.newsletter, 'Newsletter'],
  [SITE_URLS.llnd, 'My LLND Portal'],
  [SITE_URLS.contact, 'Contact Us & FAQ'],
];

const FOOT_LINKS = [
  [SITE_URLS.videos, 'Training Videos'],
  [SITE_URLS.llnd, 'My LLND Support'],
  [SITE_URLS.contact, 'Book a Consultation'],
];

// Titles + blurbs used by the quick-search modal in the header
const SEARCH_VIDEOS = [
  ['Responsible Use of AI in VET', 'Guides VET trainers and students in adopting AI ethically, verifying facts, and upholding academic integrity.'],
  ['Popular AI Tools as of June 2026', 'A review of modern generative AI platforms for educators and student research workflows.'],
  ['Staff Obligations for Inventory Check', 'Procedural obligations for trainers and assessors when conducting equipment and asset audits.'],
  ['Student Course Attendance & Academic Momentum', 'Guidelines on tracking course progress, monitoring attendance, and timely student intervention.'],
  ['Inventory and Facility Management', 'Core standards of vocational training facilities and occupational safety compliance.'],
  ['Monitoring Student Progress & Attendance Policy', 'Attendance thresholds, warnings, and learning support referral pathways.'],
  ['Monitoring Policy: Key Updates', 'Recent changes to student monitoring protocols under revised VET sector frameworks.'],
  ['Counselling & Student Support Services', 'Mental health, crisis support, and welfare counselling available across all campuses.'],
  ['Overview of the Australian VET Sector', 'Orientation to the Australian VET landscape, ASQA, training packages, and RTO governance.'],
  ['Trainer and Assessor Requirements (Standards)', 'Vocational competency, current industry skills, and TAE credential requirements.'],
  ['Training & Assessment Strategy (TAS): Updated', 'How to read, implement, and adhere to the TAS document for each qualification.'],
  ['Training and Assessment Strategy Fundamentals', 'Core principles of developing and reviewing training and assessment strategies.'],
  ['Trainer Marking Quality Checklist', 'Rubrics, evidence gathering, and constructive feedback practices.'],
  ['Generation of Verifiable USI Transcript', 'Generating and verifying authenticated Unique Student Identifier transcripts.'],
  ['Critical Incident Awareness & Response', 'Emergency response workflows, reporting channels, and trauma-informed support.'],
  ['Training Rolling Intake Model', 'How flexible rolling intakes support continuous learning momentum.'],
  ['Comprehensive Training & Wellbeing Support', 'Frameworks connecting academic mentoring, English language assistance, and wellbeing resources.'],
];

export { SITE_URLS, resolveUrl } from './urls';
export { SESSIONS, FALLBACK_UPCOMING_SESSIONS, FALLBACK_PREVIOUS_SESSIONS, nextSession } from './sessions';
export { WORD_LESSONS, WORD_LESSONS_DATA, RES_CARDS, QUICK, NAV_LINKS, MOBILE_LINKS, FOOT_LINKS, SEARCH_VIDEOS };