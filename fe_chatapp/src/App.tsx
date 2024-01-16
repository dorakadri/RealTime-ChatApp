import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Socket, io } from "socket.io-client";
import Messageinput from "./Messageinput";
import Message from "./Message";

function App() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const send = (value: string) => {
    socket?.emit("message", value);
  };
  useEffect(() => {
    const newSocket = io("http://localhost:8001");
    setSocket(newSocket);
  }, [setSocket]);

  const messageListerner = (message: string) => {
    setMessages([...messages, message]);
  };

  useEffect(() => {
    socket?.on("message", messageListerner);
    return () => {
      socket?.off("message", messageListerner);
    };
  }, [messageListerner]);

  return (
    <>
    <Messageinput send={send}/>
    <Message messages={messages}/>
    </>
  );
}

export default App;
