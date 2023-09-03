import {React} from 'react';
import Registration from './components/Register';
import SignIn from './components/SignIn';
import {CreateRide} from './components/CreateRide';
import  {Search}  from './components/Search';
import About from './components/About';
import Dashboard from './components/Dashboard';
import {HashRouter, Route, Routes} from 'react-router-dom';
import CustomRoute from './CustomRoute'
import ForgotPassword from './components/ForgotPassword';
import { AuthProvider } from './components/AuthContext';
import './App.css'

function App() {
  return (
    <HashRouter>
    <div className='App'> 
      <AuthProvider>
      <Routes>
        <Route element={<CustomRoute/>}>
        <Route exact path="/" element={<Dashboard/>}/>
        </Route>
        <Route path="/register" element={<Registration/>} />
        <Route path="/signIn" element={<SignIn/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/create" element={<CreateRide/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/about/:param" element={<About/>}/>
        <Route path="*" element={<h1>Page not found</h1>}/>
      </Routes>
      </AuthProvider>
   </div>
   </HashRouter>
  );
}

export default App;
