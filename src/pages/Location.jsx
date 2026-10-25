import {Hours,Intro,Location as Branches} from '../components/parts.jsx';

export default function Location(){
  return <>
    <Intro label="Find your way" title="Where to find us." text="Get directions and see Cafe Canunu on the map."/>
    <section className="wrap contact-section"><Branches/><div className="form-layout"><aside><h2>Opening hours.</h2><Hours/></aside></div></section>
  </>;
}
