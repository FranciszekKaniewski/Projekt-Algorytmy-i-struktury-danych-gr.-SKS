import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import crowLogo from './assets/crowLogo.png'
import './App.css'
import {useState} from "react";
import {FileInput} from "./components/FileInput/FileInput.tsx";
import {Fetch} from "./utils/Fetch.tsx";

function App() {

    const [message, setMessage] = useState("")
    const [messageSecond, setMessageSecond] = useState("")
    const [name, setName] = useState("")
    const [age, setAge] = useState(0)

  return (
      <>
          <h1>Projek Algorytmy i Struktury danych</h1>
          <h2> Uniwerstytert Mikołaja Kopernika w Trtouniu 2025 <br/> Franciszek Kaniewski | Kacper Smolarczyk | Jarema Szyński</h2>
          <div>
              <a href="https://vite.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo"/>
              </a>
              <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo"/>
              </a>
              <a href="https://crowcpp.org" target="_blank">
                  <img src={crowLogo} className="logo crow" alt="React logo"/>
              </a>
          </div>
          <h2>Vite + React + Crow cpp</h2>
          <button onClick={async () => setMessage(await Fetch('/api', "GET") as string)}>GET API TEST</button>
          <p>{message}</p>
          <button onClick={async () => setMessageSecond(await Fetch(`/api/add-json`, "POST", { a:4,b:5 }) as string)}>POST API TEST</button>
          <p>{messageSecond}</p>
          <FileInput/>
      </>
  )
}

export default App
