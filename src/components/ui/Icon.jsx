import PlayIcon from '../../assets/play.svg?react';
import LinkIcon from '../../assets/link.svg?react';
import RecordingIcon from '../../assets/recording.svg?react';
import CalendarIcon from '../../assets/calendar.svg?react';
import BookIcon from '../../assets/book.svg?react';
import LockIcon from '../../assets/lock.svg?react';
import ListCheckIcon from '../../assets/list-check.svg?react';
import NewspaperIcon from '../../assets/newspaper.svg?react';
import SearchIcon from '../../assets/search_1.svg?react';
import MobileMenuIcon from '../../assets/menu.svg?react';
import BrowseIcon from '../../assets/browse.svg?react';
import VideoIcon from '../../assets/play-alt.svg?react';
import PlayIconSimple from '../../assets/playSimple.svg?react';
import PauseIconSimple from '../../assets/pauseSimple.svg?react';
import ArrowIcon from '../../assets/arrow.svg?react';
import BooksLoop from '../../assets/animatedBooks.svg?react';
import CopySvgIcon from '../../assets/copy.svg?react';

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CopyIcon(props) {
  return <CopySvgIcon {...props} />;
}

function ArrowLeftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}>
      <path d="M19 12H5m7 7-7-7 7-7" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const ICONS = {
  play: PlayIcon,
  playSimple: PlayIconSimple,
  pauseSimple: PauseIconSimple,
  video: VideoIcon,
  link: LinkIcon,
  record: RecordingIcon,
  calendar: CalendarIcon,
  book: BookIcon,
  lock: LockIcon,
  listCheck: ListCheckIcon,
  newspaper: NewspaperIcon,
  search: SearchIcon,
  menu: MobileMenuIcon,
  browse: BrowseIcon,
  arrow: ArrowIcon,
  arrowLeft: ArrowLeftIcon,
  back: ArrowLeftIcon,
  mail: MailIcon,
  check: CheckIcon,
  close: CloseIcon,
  copy: CopyIcon,
  animatedBooks: BooksLoop,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  chevronRight: ChevronRightIcon,
  info: InfoIcon,
  download: DownloadIcon,
};

function Icon({ name, className = '', ...rest }) {
  const SvgIcon = ICONS[name];

  if (!SvgIcon) return null;

  return (
    <SvgIcon
      className={`ic ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}

export default Icon;
