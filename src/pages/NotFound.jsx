import {Button,Intro} from '../components/parts.jsx';

export default function NotFound(){
  return <>
    <Intro label="Oops" title="Page not found." text="We couldn’t find that page. Try the menu or head back home."/>
    <section className="wrap menu-section"><Button to="/">Back to home</Button> <Button to="/menu" secondary>View Menu</Button></section>
  </>;
}
