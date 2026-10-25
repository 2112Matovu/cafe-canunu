import {useState} from 'react';
import {m} from '../data.js';
import {DishCard,ImageNotice,Intro,MenuNotice} from '../components/parts.jsx';

const tags=[...new Set(m.items.flatMap(i=>i.tags))];
export default function Menu(){
  const [query,setQuery]=useState('');
  const [tag,setTag]=useState('');
  const [category,setCategory]=useState('');
  const [touched,setTouched]=useState(false);
  const q=query.trim().toLowerCase();
  const shown=m.items.filter(i=>(!category||i.category===category)&&(!tag||i.tags.includes(tag))&&(!q||(i.name+' '+i.description).toLowerCase().includes(q)));
  const choose=(set,value)=>{set(value);setTouched(true);};
  return <>
    <Intro label="Something for every moment" title="What are you craving?" text="Browse, find a favourite and build your order. We’ll help you send it through WhatsApp."/>
    <section className="wrap menu-section"><MenuNotice/>
      <div className="menu-tools"><label className="search">Search the menu<input type="search" id="menu-search" placeholder="Try matooke, coffee, something sweet…" maxLength={100} value={query} onChange={e=>choose(setQuery,e.target.value)}/></label><label className="filter">Dietary / dish tag<select id="tag-filter" value={tag} onChange={e=>choose(setTag,e.target.value)}><option value="">All tags</option>{tags.map(t=><option key={t}>{t}</option>)}</select></label></div>
      <div className="categories" role="group" aria-label="Menu category">
        <button className={category===''?'active':''} aria-pressed={category===''} onClick={()=>choose(setCategory,'')}>All dishes</button>
        {m.categories.map(cat=><button key={cat.id} className={category===cat.id?'active':''} aria-pressed={category===cat.id} onClick={()=>choose(setCategory,cat.id)}>{cat.name}</button>)}
      </div>
      <p id="menu-results" role="status" className="small muted">{touched?`${shown.length} ${shown.length===1?'dish':'dishes'} found`:`${m.items.length} dishes`}</p>
      <div className="dish-grid">{shown.map(i=><DishCard key={i.id} item={i}/>)}</div>
      <p id="empty-menu" hidden={shown.length!==0}>No dishes match. Try another search or filter.</p>
      <p className="small">Prices are in Uganda Shillings. Images are serving suggestions only.</p><ImageNotice/>
      <p className="small">Please tell the restaurant about allergies before ordering. Dietary tags describe our recipes and do not guarantee an allergen-free kitchen.</p>
    </section>
  </>;
}
