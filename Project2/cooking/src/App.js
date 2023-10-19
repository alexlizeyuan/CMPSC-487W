import { BrowserRouter, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import { useFetch } from './hooks/useFetch';
import Home from './pages/home/Home';
import Create from './pages/create/Create';
import Search from './pages/search/Search';
import Recipe from './pages/recipe/Recipe';
import Navbar from './components/Navbar';
import './App.css';
import Sort from './pages/sort/Sort';

function App() {
  // const {data, isPending, error} = useFetch("http://localhost:3000/recipes")
  // const dataArr = data

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/create">
            <Create/>
          </Route>
          <Route path="/search">
            <Search/>
          </Route>
          <Route path="/recipes/:id">
            <Recipe/>
          </Route>
          <Route path="/sort">
            <Sort/>
          </Route>
        </Switch>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
