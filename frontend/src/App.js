import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebFont from 'webfontloader';

// Import pages
import Login from './pages/login'; 
import Dashboard from './pages/dashboard';
import Status from './pages/status';
import List from './pages/list';
import BeneficiaryList from './pages/listBeneficiaire';
import MembreList from './pages/membres';
import Partners from './pages/listPartenaires';
import Event from './pages/events';
import AllEvent from './pages/allEvents';
import Activiteprv from './pages/activite_prv';
import EventprvDetails from './pages/activitePriveDetails';
import EventDetails from './pages/eventDetails';
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
import AllEvents from './pages/showAllEvent';
import DetailsEvent from './pages/showEventDetails';
import EventAvenir from './pages/event-avenir';
import Profileb from './pages/profileb';
import InfosUser from './pages/infosUser';

// Import styles
import './css/home.css';
import './css/signup.css';  
import './css/admin.css';
import './css/loginb.css';

// Import authentication wrapper
import ProtectedRoute from './pages/hooks/authToken';
import OneSignalManager from './components/OneSignalManager';

// Load web fonts
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_success" element={<SignupSuccess />} />
        <Route path="/loginb" element={<Loginb />} />
        <Route path="/" element={<Home />} />

        {/* Protected Routes for Admins */}
        <Route element={<ProtectedRoute userType="admin"/>}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/status" element={<Status />} />
            <Route path="/admin/list" element={<List />} />
            <Route path="/admin/beneficiaires" element={<BeneficiaryList />} />
            <Route path="/admin/membres" element={<MembreList />} />
            <Route path="/admin/events" element={<Event />} />
            <Route path="/admin/AllEvents" element={<AllEvent />} />
            <Route path="/admin/activiteprv" element={<Activiteprv />} />
            <Route path="/admin/activity-details/:eventId" element={<EventDetails />} />
            <Route path="/admin/volunteers/:eventId" element={<ParticipantsList />} />
            <Route path="/admin/beneficiaires/:eventId" element={<ParticipantsBenefList />} />
            <Route path="/admin/activiteprv_details/:eventId" element={<EventprvDetails />} />
            <Route path="/admin/partners" element={<Partners />} />
            <Route path="/admin/newsletter" element={<Newsletter />} />
            <Route path="/admin/historyActivity" element={<History />} />
            <Route path="/admin/infosUser/:typePath/:email" element={<InfosUser />} />
        </Route>

        {/* Protected Routes for Volunteers */}
        <Route element={<ProtectedRoute userType="volunteer"/>}>
          <Route path="/volunteer/dashboard" element={<Dashboardv />} />
          <Route path="/volunteer/evenements" element={<Events />} />
          <Route path="/volunteer/all-events" element={<AllEvents />} />
          <Route path="/volunteer/activity-details/:eventId" element={<DetailsEvent />} />
          <Route path="/volunteer/activity-avenir/:id" element={<EventAvenir />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
