import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Link,NavLink} from 'react-router-dom';
import {c,navPages,hasExtras} from '../data.js';
import {pages,pagePath,pageTitle,pageUrl} from '../seo.js';
import {useShop} from '../context.jsx';
import {storage} from '../storage.js';
import {Hours,Logo,Socials} from './parts.jsx';
import {Signup} from './forms.jsx';

const ICONS={
  index:<path d="m3 10 9-7 9 7v10H3Z M9 20v-7h6v7"/>,
  menu:<path d="M5 3v7m4-7v7M3 3v5a4 4 0 0 0 8 0V3M7 12v9M18 3c-4 4-4 9 0 10v8M18 3v10h3V3Z"/>,
  about:<><circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-10v.1"/></>,
  gallery:<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 6-5 4 4 3-3 5 5"/></>,
  reservations:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-14 4h3m4 0h3m-10 3h3"/></>,
  contact:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
  location:<><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21Z"/><circle cx="12" cy="9.500" r="2.500"/></>,
  feedback:<><path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z"/><path d="M7 10h10M7 14h6"/></>
};
const NavIcon=({name})=><span className="entrance-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{ICONS[name]}</svg></span>;
// The home link is hidden while on the home page.
const NavLinks=({page})=>navPages.filter(k=>!(k==='index'&&page==='index')).map(k=><NavLink key={k} to={pagePath(k)} end>{page==='index'&&<NavIcon name={k}/>}{pages[k]}</NavLink>);

function setMeta(selector,create,attrs){
  let el=document.head.querySelector(selector);
  if(!el){el=document.createElement(create);document.head.append(el);}
  for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);
}
function usePageHead(page){
  useEffect(()=>{
    const title=pageTitle(page,c),url=pageUrl(page,c);
    document.title=title;
    setMeta('meta[property="og:title"]','meta',{property:'og:title',content:title});
    if(url){
      setMeta('link[rel="canonical"]','link',{rel:'canonical',href:url});
      setMeta('meta[property="og:url"]','meta',{property:'og:url',content:url});
    }
  },[page]);
}

function MessageDialog(){
  const {message}=useShop();
  const dialog=useRef(),preview=useRef();
  const [copyStatus,setCopyStatus]=useState('');
  useEffect(()=>{if(!message)return;setCopyStatus('');if(!dialog.current.open)dialog.current.showModal();},[message]);
  const email=message?.channel==='email',url=message?.url||'';
  async function copy(){
    try{await navigator.clipboard.writeText(message.text);setCopyStatus('Message copied.');}
    catch{preview.current.focus();preview.current.select();setCopyStatus('Select and copy the message above.');}
  }
  const explanation=url
    ?`Review your details, then open ${email?'your email app':'WhatsApp'} to send. The restaurant must reply to confirm.`
    :`The restaurant’s ${email?'email address':'WhatsApp number'} has not been configured yet. Your message has not been sent. You can copy this preview.`;
  return <dialog id="message-dialog" ref={dialog} aria-labelledby="message-title" onClick={backdropClose}>
    <button className="dialog-close" onClick={()=>dialog.current.close()} aria-label="Close message">×</button>
    <h2 id="message-title">Before you send</h2>
    <p id="message-explanation">{message&&explanation}</p>
    <label>Message preview<textarea id="message-preview" ref={preview} rows={9} readOnly value={message?.text||''}/></label>
    <div className="form-actions"><button className="button secondary" onClick={copy}>Copy message</button><a className="button" id="continue-message" hidden={!url} href={url||undefined} target={email?'_self':'_blank'} rel="noopener noreferrer">{email?'Open email ↗':'Open WhatsApp ↗'}</a></div>
    <p className="small">Opening a messaging app does not send or confirm your request.</p>
    <p id="copy-status" role="status">{copyStatus}</p>
  </dialog>;
}
// Clicking the dimmed area around a modal dialog closes it.
export function backdropClose(event){
  const d=event.currentTarget;if(event.target!==d)return;
  const r=d.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();
}

// Follows the device's light/dark setting until the visitor picks a theme with the toggle; that choice is remembered.
const systemQuery=()=>typeof matchMedia==='function'?matchMedia('(prefers-color-scheme: dark)'):null;
function useThemePreference(){
  const saved=()=>{const v=storage.get('canunu-theme');return v==='dark'||v==='light'?v:null;};
  const [theme,setThemeState]=useState(()=>saved()||(systemQuery()?.matches?'dark':'light'));
  useEffect(()=>{
    const query=systemQuery();if(!query)return;
    const follow=e=>{if(!saved())setThemeState(e.matches?'dark':'light');};
    query.addEventListener('change',follow);return ()=>query.removeEventListener('change',follow);
  },[]);
  const setTheme=next=>{setThemeState(next);storage.set('canunu-theme',next);};
  return [theme,setTheme];
}

export default function Layout({page,children}){
  const {count,toastText,toastVisible}=useShop();
  const [theme,setTheme]=useThemePreference();
  usePageHead(page);
  useLayoutEffect(()=>{document.body.dataset.page=page;},[page]);
  useLayoutEffect(()=>{document.body.dataset.theme=theme;},[theme]);
  useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'});},[page]);
  const toggleTheme=()=>setTheme(theme==='dark'?'light':'dark');
  return <>
    <a className="skip" href="#main">Skip to content</a>
    {c.previewNotice&&<div className="preview-bar">{c.previewNotice}</div>}
    <header className="site-header"><div className="nav-wrap">
      <Link to="/" className="brand" aria-label={`${c.name} home`}><Logo/></Link>
      <nav id="site-nav" aria-label="Main navigation"><NavLinks page={page}/></nav>
      <div className="header-actions">
        {c.features.darkMode&&<button id="theme-toggle" onClick={toggleTheme} aria-pressed={theme==='dark'} aria-label={theme==='dark'?'Switch to light theme':'Switch to dark theme'}>◐</button>}
        {page!=='index'&&<Link className="button order-nav" to="/order">Order Now <span className="cart-count" aria-label="items in cart">{count}</span></Link>}
      </div>
    </div></header>
    <main id="main">{children}</main>
    <footer>
      <div className="wrap footer-grid">
        <div><Link to="/" className="brand" aria-label={`${c.name} home`}><Logo/></Link><p>{c.tagline}</p><p className="small">{c.branches[0].address}<br/>{c.locationLabel}<br/>{c.phone}<br/>{c.email}</p><Socials/></div>
        <div><h2>Come on in</h2><nav aria-label="Footer navigation"><NavLinks page={page}/>{hasExtras&&<NavLink to="/extras" end>More at Canunu</NavLink>}</nav></div>
        <div><h2>Opening hours</h2><Hours/></div>
        <div><Signup/></div>
      </div>
      <div className="wrap footer-bottom"><span>© 2026 {c.name}. All rights reserved.</span><div><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Use</Link></div></div>
    </footer>
    <Link className="mobile-order" to="/order">Start your order <span>↗ <span className="cart-count">{count}</span></span></Link>
    <div id="toast" role="status" aria-live="polite" className={toastVisible?'visible':''}>{toastText}</div>
    <MessageDialog/>
  </>;
}
