import React from "react";

const Message = ({ messages }: { messages: string[] }) => {
  return (
    <div>
 {messages.map((message,index)=>(
    <div key={index}>
        {message}
    </div>
 ))}
    </div>
  );
};

export default Message;
