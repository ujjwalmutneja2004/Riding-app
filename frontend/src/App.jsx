import { Routes, Route } from "react-router-dom"; // Don't forget to import Route
import Userlogin from "./pages/Userlogin";
import  UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Start from "./pages/Start";
import Homee from "./pages/Homee";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProtectWrapper from "./pages/UserProtectWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import SetToken from "./pages/Set-token";

import UserRideHistory from "./pages/UserRideHistory";
import CaptainDashboard from "./pages/CaptainDashboard";
import CaptainRideHistory from "./pages/CaptainRideHistory";
import CaptainStatus from "./pages/CaptainStatus";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApprovalQueue from "./pages/AdminApprovalQueue";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectWrapper from "./pages/AdminProtectWrapper";
import AdminCaptains from "./pages/AdminCaptains";
import AdminCaptainDetails from "./pages/AdminCaptainDetails";
import CaptainProfile from "./pages/CaptainProfile";

const App = () => {
  return (
    
    <div>
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light"
      />
       
      <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/login' element={<Userlogin/>} />
        <Route path='/riding' element={<Riding/>} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/captain-signup' element={<CaptainSignup />} />
        <Route path='/captain-status' element={<CaptainStatus />} />
        <Route path="/set-token" element={<SetToken />} />
        <Route path='/home' element={
          <UserProtectWrapper>
                <Homee />
          </UserProtectWrapper>
      } />
      <Route path='/user/logout' element={<UserProtectWrapper>
             <UserLogout/>
      </UserProtectWrapper>}/>

      <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>
        } />

    <Route path="/Captain-riding" element={<CaptainRiding />} />

        <Route path='/user/history' element={
          <UserProtectWrapper>
            <UserRideHistory />
          </UserProtectWrapper>
        } />

        <Route path='/captain-dashboard' element={
          <CaptainProtectWrapper>
            <CaptainDashboard />
          </CaptainProtectWrapper>
        } />

        <Route path='/captain-history' element={
          <CaptainProtectWrapper>
            <CaptainRideHistory />
          </CaptainProtectWrapper>
        } />

        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={
          <AdminProtectWrapper>
            <AdminDashboard />
          </AdminProtectWrapper>
        } />
        <Route path='/admin/approvals' element={
          <AdminProtectWrapper>
            <AdminApprovalQueue />
          </AdminProtectWrapper>
        } />
        <Route path='/admin/captains' element={
          <AdminProtectWrapper>
            <AdminCaptains />
          </AdminProtectWrapper>
        } />
        <Route path='/admin/captain/:id' element={
          <AdminProtectWrapper>
            <AdminCaptainDetails />
          </AdminProtectWrapper>
        } />
        <Route path='/captain-profile' element={
          <CaptainProtectWrapper>
            <CaptainProfile />
          </CaptainProtectWrapper>
        } />

      </Routes>
    </div>
  );
}

export default App; // Only export App, no need to export Home here
