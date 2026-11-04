import { useRef } from 'react';
import Icon from '../ui/Icon';
import Link from '../ui/Link';
import Reveal from '../ui/Reveal';
import { prefersReduced } from '../../lib/utils';

function ResCard({ card, index }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (!fine || prefersReduced()) return;
    const c = ref.current; const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    c.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    c.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
  };
  const onLeave = () => { ref.current.style.setProperty('--ry', '0deg'); ref.current.style.setProperty('--rx', '0deg'); };
  const words = (card.t || '').split(' ');
  const lead = words.length > 1 ? words.slice(0, -1).join(' ') : '';
  const last = words[words.length - 1];

  return (
    <Reveal className="tilt-wrap" delay={index * 0.09}>
      <Link ref={ref} to={card.to} className={`rcard glass ${card.cls}`} onPointerMove={onMove} onPointerLeave={onLeave}>
        {card.isNew}
        <span className="ico"><Icon name={card.icon} /></span>
        <h3>
          {lead ? `${lead} ` : ''}
          <span className="hl-word">{last}</span>
        </h3>
        <p>{card.d}</p>
        <span className="go"><Icon name="arrow" /></span>
      </Link>
    </Reveal>
  );
}

export default ResCard;