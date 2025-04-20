import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { LocationProvider } from './context/LocationContext'; 


createRoot(document.getElementById("root")).render(
  <UserContext>
    <CaptainContext>
      <SocketProvider>
         <LocationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
           </LocationProvider>
      </SocketProvider>
    </CaptainContext>
  </UserContext>
);
