import {Navigate,Route,Routes,useLocation} from 'react-router-dom';
import {enabledPages,pageFromPath} from './data.js';
import {pagePath} from './seo.js';
import {ShopProvider} from './context.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import About from './pages/About.jsx';
import Gallery from './pages/Gallery.jsx';
import Reservations from './pages/Reservations.jsx';
import Location from './pages/Location.jsx';
import Contact from './pages/Contact.jsx';
import Feedback from './pages/Feedback.jsx';
import Legal from './pages/Legal.jsx';
import Extras from './pages/Extras.jsx';
import Order from './pages/Order.jsx';
import NotFound from './pages/NotFound.jsx';

const views={index:<Home/>,menu:<Menu/>,about:<About/>,gallery:<Gallery/>,location:<Location/>,reservations:<Reservations/>,contact:<Contact/>,feedback:<Feedback/>,privacy:<Legal page="privacy"/>,terms:<Legal page="terms"/>,extras:<Extras/>,order:<Order/>};

export default function App(){
  const page=pageFromPath(useLocation().pathname);
  return <ShopProvider><Layout page={page}><Routes>
    {enabledPages.map(p=><Route key={p} path={pagePath(p)} element={views[p]}/>)}
    {/* The site used to be static .html files; keep old links and bookmarks working. */}
    {enabledPages.map(p=><Route key={p+'.html'} path={`/${p}.html`} element={<Navigate to={pagePath(p)} replace/>}/>)}
    <Route path="*" element={<NotFound/>}/>
  </Routes></Layout></ShopProvider>;
}
