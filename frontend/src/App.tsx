import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import crowLogo from './assets/crowLogo.png'
import './App.css'
import {useState} from "react";
import {FileInput} from "./components/FileInput/FileInput.tsx";
import {Map} from "./components/Map/Map.tsx";
import {Edge, Path, Vertex} from "./interfaces/interfaces.ts";

function App() {

    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const [pathing, setPathing] = useState<Path[]>([]);
    const [showPaths, setShowPaths] = useState<"barley"|"beer"|null>(null);

  return (
      <>
          <h1>Projek Algorytmy i Struktury danych</h1>
          <h2> Uniwersytet Mikołaja Kopernika w Toruniu 2025 <br/> Franciszek Kaniewski | Kacper Smolarczyk | Jarema Szyński</h2>
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
          <FileInput setVertices={setVertices} setEdges={setEdges} setPathing={setPathing} showPaths={showPaths} setShowPaths={setShowPaths} />
          <Map vertices={vertices ?? []} edges={edges ?? []} pathing={pathing} showPaths={showPaths}/>
      </>
  )
}

export default App
