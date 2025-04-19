import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create the SocketContext
const SocketContext = createContext();

// SocketContext Provider
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(`${import.meta.env.VITE_BASE_URL}`, {
      withCredentials: true,
    });

    // Log connection and disconnection events
    newSocket.on("connect", () => {
      console.log("Connected to server with socket ID:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to send a message to a specific event
  // const sendMessage = (event, data) => {
  //   if (socket) {
  //     socket.emit(event, data);
  //   } else {
  //     console.error("Socket is not connected");
  //   }
  // };

  // // Function to listen for messages from a specific event
  // const receiveMessage = (event, callback) => {
  //   if (socket) {
  //     socket.on(event, callback);
  //   } else {
  //     console.error("Socket is not connected");
  //   }
  // };

  return (
    <SocketContext.Provider value={{ socket}}>
      {children}
    </SocketContext.Provider>
  );
};

// // Custom hook to use the SocketContext
// const useSocket = () => {
//   return useContext(SocketContext);
// };

export { SocketProvider, SocketContext };





//This line inside useEffect is the cleanup function. It runs when the component unmounts (i.e., when the provider is removed from the DOM). That’s when the socket disconnects.

// So to be precise:

// ✅ The socket will disconnect when:
// The SocketProvider component unmounts (e.g., navigating away from a page that uses it).

// The user closes the browser tab or reloads the page.

// There is a network failure, or the server goes down.

// The server emits a disconnect event.

// The socket is manually disconnected via socket.disconnect() (like in the cleanup).

