import {c} from '../data.js';
import {ImageNotice,Intro,Picture} from '../components/parts.jsx';

export default function About(){
  const tag=c.about.confirmed?'':' · Placeholder';
  return <>
    <Intro label={c.about.eyebrow} title={c.about.title} text="Meet Cafe Canunu in Soroti, Uganda."/>
    <section className="wrap story-strip"><div className="story-image"><Picture slug="hero-cafe-table" alt={c.hero.find(h=>h.image==='hero-cafe-table')?.alt||'Cafe table setting'}/></div><div><p className="eyebrow">The Canunu story{tag}</p><h2>Food brings<br/>people together.</h2><p>{c.about.story}</p></div></section>
    <section className="wrap two-col content-section"><article><p className="eyebrow">What matters to us{tag}</p><h2>Our values.</h2><p>{c.about.values}</p></article><article><p className="eyebrow">The people behind the plates{tag}</p><h2>Meet the team.</h2><p>{c.about.team}</p></article></section>
    <section className="wrap"><ImageNotice/></section>
  </>;
}
