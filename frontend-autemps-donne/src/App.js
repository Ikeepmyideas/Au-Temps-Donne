import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'; 
import WebFont from 'webfontloader';
import Dashboard from './pages/dashboard';
import Status from './pages/status';
import List from './pages/list';
import BeneficiaryList from './pages/listBeneficiaire';
import MembreList  from './pages/membres';
import Event from './pages/events';
import AllEvent from  "./pages/allEvents";
import Activiteprv from  "./pages/activite_prv";
import EventprvDetails from './pages/activitePriveDetails';
import EventDetails from  './pages/eventDetails';
import ParticipantsList from './pages/volunteers';
import ParticipantsBenefList from './pages/beneficiary';
import Signupb from './pages/signupb';
import Loginb from './pages/loginb';
import Dashboardb from './pages/homepageb';
import Profileb from './pages/profileb';
import UpdateProfileForm from './pages/UpdateProfileForm';
import Calendarb from './pages/calendarb';
import Dashboardv from './pages/dashboardv';
import Loginc from './pages/loginc';
import Dashboardc from './pages/dashboardc';
import Home from './pages/home';
import Signup from './pages/signup';
import SignupSuccess from './pages/signup_success';






WebFont.load({
  google: {
    families: ['Inter:wght@400;700']
  }
});
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_success" element={<SignupSuccess />} />
      <Route path="/Dashboardc" element={<Dashboardc />} />
      <Route path="/Loginc" element={<Loginc />} />
      <Route path="/Dashboardv" element={<Dashboardv />} />
      <Route path="/Calendarb" element={<Calendarb />} />
      <Route path="/UpdateProfileFormb" element={<UpdateProfileForm />} />
        <Route path="/dashboardb" element={<Dashboardb />} />
        <Route path="/profileb" element={<Profileb />} />
        <Route path="/signupb" element={<Signupb />} />
        <Route path="/loginb" element={<Loginb />} />  
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/status" element={<Status />} /> 
        <Route path="/list" element={<List />} /> 
        <Route path="/beneficiaires" element={<BeneficiaryList />} /> 
        <Route path="/membres" element={<MembreList />} /> 
        <Route path="/events" element={<Event />} /> 
        <Route path="/AllEvents" element={<AllEvent />} /> 
        <Route path="/activiteprv" element={<Activiteprv />} /> 
        <Route path="/activity-details/:eventId" element={<EventDetails />} />
        <Route path="/volunteers/:eventId" element={<ParticipantsList />} /> 
        <Route path="/beneficiaires/:eventId" element={<ParticipantsBenefList />} /> 
        <Route path="/activiteprv_details/:eventId" element={<EventprvDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
