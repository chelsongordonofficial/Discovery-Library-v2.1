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
  { k: 'Journal article', ref: 'Lee, A. (2023). Enhancing student engagement in vocational education. Journal of VET Research, 12(3), 45–60. https://doi.org/10.1016/j.vet.2023.01.004', it: '(Lee, 2023)', n: 'Include volume, issue in parentheses, page range, and DOI URL whenever available.' },
  { k: 'Webpage', ref: 'Nguyen, T. (2025, May 12). Managing academic momentum in blended learning. Discovery Learning Insights. https://discoverylibrary.com.au/resources/momentum', it: '(Nguyen, 2025)', n: 'Include the site name when it differs from the author. Provide full URL.' },
  { k: 'Blog post', ref: 'Patel, R. (2025, June 3). Five principles for responsible AI usage in TAFE and VET. Education Tomorrow. https://educationtomorrow.edu.au/ai-principles', it: '(Patel, 2025)', n: 'Format like a webpage, specifying the specific blog publication name.' },
  { k: 'eBook', ref: 'Smith, J. (2024). Essential vocational training and workplace assessment (2nd ed.). Academic Press. https://doi.org/10.1007/978-3-030-12345-6', it: '(Smith, 2024)', n: 'Include book edition in parentheses if applicable, followed by publisher and DOI/URL.' },
];

const NAV_LINKS = [
  { to: SITE_URLS.resources, label: 'Resources', icon: 'book' },
  { to: SITE_URLS.videos, label: 'Videos', icon: 'video' },
  { to: SITE_URLS.sessions, label: 'Sessions', icon: 'calendar' },
  { to: SITE_URLS.referencing, label: 'Referencing', icon: 'listCheck' },
  { to: SITE_URLS.newsletter, label: 'Newsletter', icon: 'newspaper' },
];

const MOBILE_LINKS = [
  [SITE_URLS.home, 'Home'],
  [SITE_URLS.resources, 'Library Resources'],
  [SITE_URLS.videos, 'Training Videos'],
  [SITE_URLS.links, 'Useful Links & Videos'],
  [SITE_URLS.recordings, 'Session Recordings'],
  [SITE_URLS.sessions, 'Upcoming Sessions'],
  [SITE_URLS.referencing, 'Referencing Guide'],
  [SITE_URLS.newsletter, 'Newsletters'],
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