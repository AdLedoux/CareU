import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/hello/`)

      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Error: " + err));
  }, []);

  return (
    <div>
      <h1>React + Django Test</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
