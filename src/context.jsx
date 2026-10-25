import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {c,m} from './data.js';
import {cleanCart,waUrl,emailValid} from './lib.js';
import {storage} from './storage.js';
const CART_KEY='canunu-cart';
const Shop=createContext(null);
export const useShop=()=>useContext(Shop);
const loadCart=()=>{try{return cleanCart(JSON.parse(storage.get(CART_KEY)||'[]'),m.items);}catch{return [];}};

export function ShopProvider({children}){
  const [cart,setCart]=useState(loadCart);
  const [toastText,setToastText]=useState('');
  const [toastVisible,setToastVisible]=useState(false);
  const [message,setMessage]=useState(null);
  const cartRef=useRef(cart),timer=useRef();
  const toast=useCallback(text=>{setToastText(text);setToastVisible(true);clearTimeout(timer.current);timer.current=setTimeout(()=>setToastVisible(false),3500);},[]);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  // Returns whether the cart could be written to browser storage.
  const commit=useCallback(next=>{next=cleanCart(next,m.items);cartRef.current=next;setCart(next);return storage.set(CART_KEY,JSON.stringify(next));},[]);
  useEffect(()=>{
    const sync=event=>{if(event.key!==CART_KEY)return;let next;try{next=cleanCart(JSON.parse(event.newValue||'[]'),m.items);}catch{next=[];}cartRef.current=next;setCart(next);};
    window.addEventListener('storage',sync);return ()=>window.removeEventListener('storage',sync);
  },[]);
  const addItem=useCallback(id=>{
    const row=cartRef.current.find(r=>r.id===id);
    if(row&&row.quantity>=99){toast('Maximum 99 of each dish.');return;}
    const next=row?cartRef.current.map(r=>r.id===id?{...r,quantity:r.quantity+1}:r):[...cartRef.current,{id,quantity:1}];
    const stored=commit(next);
    toast(`${m.items.find(i=>i.id===id).name} added.${stored?'':' Browser storage is unavailable; the cart may not survive a refresh.'}`);
  },[commit,toast]);
  const changeQuantity=useCallback((id,delta)=>{
    const row=cartRef.current.find(r=>r.id===id);if(!row)return;
    commit(cartRef.current.map(r=>r.id===id?{...r,quantity:r.quantity+delta}:r));
  },[commit]);
  const removeItem=useCallback(id=>{commit(cartRef.current.filter(r=>r.id!==id));toast('Dish removed.');},[commit,toast]);
  const openMessage=useCallback((text,channel='whatsapp',subject='Cafe Canunu enquiry')=>{
    let url='';
    if(channel==='email'&&emailValid(c.email))url=`mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    if(channel==='whatsapp')url=waUrl(c.whatsapp,text);
    setMessage({text,channel,url,stamp:Date.now()});
  },[]);
  const count=cart.reduce((n,row)=>n+row.quantity,0);
  const value=useMemo(()=>({cart,count,addItem,changeQuantity,removeItem,toast,toastText,toastVisible,message,openMessage}),[cart,count,addItem,changeQuantity,removeItem,toast,toastText,toastVisible,message,openMessage]);
  return <Shop.Provider value={value}>{children}</Shop.Provider>;
}
