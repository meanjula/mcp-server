import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState("")
   useEffect(() => {
    fetch("http://localhost:5000/api")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch((err) => console.error("Fetch error:", err));
  }, []);
  console.log(message)
  return (
    <>
      <h1>Vite + React + Typescript</h1>
      <div className="card">
        <p>
          This is a sample application to demonstrate a Vite, React setup with
          Typescript.
        </p>
        <p>Message from backend: <span className="message">{message}</span></p>
      </div>
    </>
  )
}

export default App
