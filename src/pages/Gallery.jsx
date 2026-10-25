import {useRef,useState} from 'react';
import {c,m,base} from '../data.js';
import {ImageNotice,Intro,Picture} from '../components/parts.jsx';
import {backdropClose} from '../components/Layout.jsx';

const gallery=[...c.hero.map(h=>({image:h.image,alt:h.alt})),...m.items];
export default function Gallery(){
  const dialog=useRef();
  const [current,setCurrent]=useState(0);
  const [opened,setOpened]=useState(false);
  const show=next=>setCurrent((next+gallery.length)%gallery.length);
  const item=gallery[current];
  return <>
    <Intro label="A taste of Canunu" title="Feast your eyes." text="A collection of food and cafe inspirations. Tap any image to take a closer look."/>
    <section className="wrap gallery-section"><ImageNotice/>
      <div className="gallery-grid">{gallery.map((i,index)=><button key={index} className="gallery-item" aria-label={`Enlarge: ${i.alt}`} onClick={()=>{show(index);setOpened(true);dialog.current.showModal();}}><Picture slug={i.image} alt={i.alt}/><span>Take a closer look ↗</span></button>)}</div>
    </section>
    <dialog id="lightbox" ref={dialog} aria-label="Image viewer" onClick={backdropClose} onClose={()=>setOpened(false)} onKeyDown={e=>{if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);}}>
      <button className="dialog-close" onClick={()=>dialog.current.close()} aria-label="Close image viewer">×</button>
      <img id="lightbox-image" src={opened?`${base+item.image}.webp`:undefined} alt={opened?item.alt:'Enlarged gallery image'} width={1200} height={900}/>
      <p id="lightbox-caption">{opened&&`${item.alt} · ${c.imageNotice}`}</p>
      <div className="form-actions"><button id="lightbox-prev" className="button secondary" onClick={()=>show(current-1)}>← Previous</button><button id="lightbox-next" className="button secondary" onClick={()=>show(current+1)}>Next →</button></div>
    </dialog>
  </>;
}
