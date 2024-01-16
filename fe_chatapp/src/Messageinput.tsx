import React, { useState } from "react";

function Messageinput({ send }: { send: (val: string) => void }) {
  const [value, setValue] = useState<string>("");
  return (
    <div>
      <input  onChange={(e)=>setValue(e.target.value)} type="text" placeholder="type ur message" value={value} />
      <button onClick={() => send(value)}>send</button>
    </div>
  );
}

export default Messageinput;
