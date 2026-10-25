import {test,expect,beforeAll} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach} from 'vitest';
import App from '../src/App.jsx';
import {enabledPages,pageFromPath} from '../src/data.js';
import {pagePath} from '../src/seo.js';

beforeAll(()=>{window.scrollTo=()=>{};});
afterEach(()=>{cleanup();localStorage.clear();});
const view=path=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>);

test.each(enabledPages)('%s renders one H1, alt text and valid internal links',page=>{
  const {container}=view(pagePath(page));
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  for(const img of container.querySelectorAll('img'))expect(img.getAttribute('alt')).toBeTruthy();
  for(const a of container.querySelectorAll('a[href]')){
    const href=a.getAttribute('href');
    if(/^(https:|mailto:|tel:|#)/.test(href))continue;
    expect(enabledPages.map(pagePath),`${page}: ${href}`).toContain(href);
  }
  expect(document.body.dataset.page).toBe(page);
});
test('unknown paths show the not-found page',()=>{
  view('/nope');
  expect(screen.getByRole('heading',{level:1}).textContent).toBe('Page not found.');
  expect(pageFromPath('/nope')).toBe('notfound');
});
test('old .html links redirect to the new routes',()=>{
  view('/menu.html');
  expect(screen.getByRole('heading',{level:1}).textContent).toBe('What are you craving?');
});
test('menu search filters dishes and the cart count updates',()=>{
  view('/menu');
  fireEvent.change(screen.getByPlaceholderText(/matooke/),{target:{value:'coffee'}});
  expect(document.querySelectorAll('.dish')).toHaveLength(1);
  expect(document.getElementById('menu-results').textContent).toBe('1 dish found');
  fireEvent.click(screen.getByRole('button',{name:/Add Ugandan coffee/}));
  expect(document.querySelector('.order-nav .cart-count').textContent).toBe('1');
  expect(JSON.parse(localStorage.getItem('canunu-cart'))).toEqual([{id:'coffee',quantity:1}]);
});

function mockScheme(dark){
  const listeners=new Set();
  window.matchMedia=query=>({matches:dark&&query.includes('dark'),media:query,addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>listeners.delete(fn)});
}
test('theme follows the device unless the visitor has chosen one',()=>{
  mockScheme(true);
  view('/menu');
  expect(document.body.dataset.theme).toBe('dark');
  cleanup();
  localStorage.setItem('canunu-theme','light');
  view('/menu');
  expect(document.body.dataset.theme).toBe('light');
  cleanup();localStorage.clear();mockScheme(false);
  view('/menu');
  expect(document.body.dataset.theme).toBe('light');
});

test('home shows the Google guest reviews with attribution',()=>{
  const {container}=view('/');
  const quotes=[...container.querySelectorAll('.review-grid figure')];
  expect(quotes).toHaveLength(3);
  expect(container.textContent).toContain('Google review');
  expect(container.textContent).not.toContain('Placeholder');
});
