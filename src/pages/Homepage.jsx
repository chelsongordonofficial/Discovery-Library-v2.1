import Hero from '../components/sections/Hero';
import StartHere from '../components/sections/StartHere';
import WordSeries from '../components/sections/WordSeries';
import ComingUp from '../components/sections/ComingUp';
import ApaQuick from '../components/sections/ApaQuick';

export default function Homepage({ cueHidden, onCopy }) {
  return (
    <div className="page page-home">
      <Hero cueHidden={cueHidden} />
      <StartHere />
      <WordSeries />
      <ComingUp />
      <ApaQuick onCopy={onCopy} />
    </div>
  );
}