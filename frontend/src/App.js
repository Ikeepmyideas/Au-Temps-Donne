import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'; 
import WebFont from 'webfontloader';
import Dashboard from './pages/dashboard';
import Status from './pages/status';
import List from './pages/list';
import BeneficiaryList from './pages/listBeneficiaire';
import MembreList  from './pages/membres';
import Partners  from './pages/listPartenaires';
import Event from './pages/events';
import AllEvent from  "./pages/allEvents";
import Activiteprv from  "./pages/activite_prv";
import EventprvDetails from './pages/activitePriveDetails';
import EventDetails from  './pages/eventDetails';
import ParticipantsList from './pages/volunteers';
import ParticipantsBenefList from './pages/beneficiary';
import Home from './pages/home';
import Signup from './pages/signup';
import SignupSuccess from './pages/signup_success';
import Newsletter from './pages/newsletter';
import History from './pages/HistoryEvents';
import Board from './pages/volunteer/dashboardVolunteer';
import Loginb from './pages/loginb';
import Activity from './pages/ActivityPubliqueDetails';
import Dashboardb from './pages/homepageb';
import Dashboardv from './pages/dashboardv';
import Events from './pages/evenements';
import AllEvents from './pages/showAllEvent'
import DetailsEventP from './pages/showEventDetails';
import Profileb from './pages/profileb';

WebFont.load({
  google: {
    families: ['Inter:wght@400;700']
  }
});
function App() {
  return (
    <Router>
      <Routes>
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
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_success" element={<SignupSuccess />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/historyActivity" element={<History />} />
        <Route path="/DashboardVolunteer" element={<Board />} />
        <Route path="/ActivityPubliqueDetails/:eventId" element={<Activity />} />  
        <Route path="/loginb" element={<Loginb />} />  
        <Route path="/Dashboardv" element={<Dashboardv />}  />
        <Route path="/dashboardb" element={<Dashboardb />} />
        <Route path="/Evenements" element={<Events />} />
        <Route path="/AllEvenements" element={<AllEvents />} />
        <Route path="/DetailsEvenement/:eventId" element={<DetailsEventP />} />
        <Route path="/profilb" element={<Profileb />} />
      </Routes>
    </Router>
  );
}

export default App;
