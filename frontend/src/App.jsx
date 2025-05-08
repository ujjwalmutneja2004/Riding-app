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

    <Route path="/Captain-riding" element={<CaptainRiding />} />

      </Routes>
    </div>
  );
}

export default App; // Only export App, no need to export Home here
