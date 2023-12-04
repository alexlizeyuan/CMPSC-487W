import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'


//styles
import './App.css'

//pages and components
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Create from './pages/create/Create';
import Project from './pages/project/Project';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Usermanager from './pages/usermanager/Usermanager';
import UsermanagerAdd from './pages/usermanager/UsermanagerAdd';
import { useAuthContext } from './hooks/useAuthContext';
import OnlineUsers from './components/OnlineUsers';
import { useCollection } from './hooks/useCollection';


function App() {
    const {user, authIsReady} = useAuthContext()
    const {documents, error} = useCollection('users')

    let logginUser = null
    if (user && documents){
      logginUser =  documents.filter(u => (u.id === user.uid))[0]
    }
    // console.log(logginUser)


    

 

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter> 
        {user && <Sidebar />}
        <div className='container'>
          <Navbar />
          <Switch>
            <Route exact path="/">
              {!user && <Redirect to="/login" />}
              {user && <Dashboard logginUser={logginUser}/>}
            </Route>

            <Route path="/create">
              {!user && <Redirect to="/login" />}
              {user && <Create logginUser={logginUser}/>}
            </Route>

            <Route path="/projects/:id">
              {!user && <Redirect to="/login" />}
              {user && <Project logginUser={logginUser}/>}
            </Route>

            <Route exact path="/usermanager/">
              {!user && <Redirect to="/login" />}
              {user && <Redirect to="/" />}
            </Route>

            <Route exact path="/usermanager/adduser">
              {!user && <Redirect to="/login" />}
              {user && logginUser && logginUser.role === 'manager' && <UsermanagerAdd logginUser={logginUser}/>}
            </Route>

            <Route path="/usermanager/:id">
              {!user && <Redirect to="/login" />}
              {user && logginUser && logginUser.role === 'manager' && <Usermanager logginUser={logginUser}/>}
            </Route>


            <Route path="/login">
              {!user && <Login />}
              {user && <Redirect to="/" />}
            </Route>

            <Route path="/signup">
              {!user && <Signup />}
              {user && <Redirect to="/" />}
            </Route>

          </Switch>
        </div>
        { user && logginUser && logginUser.role !== 'tenant' &&<OnlineUsers logginUser={logginUser}/>}
      </BrowserRouter> 

      )}
      
        
      

    </div>
  );
}

export default App

