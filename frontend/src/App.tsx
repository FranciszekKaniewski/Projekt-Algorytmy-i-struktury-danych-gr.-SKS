import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import crowLogo from './assets/crowLogo.png'
import './App.css'
import {useState} from "react";
import {FileInput} from "./components/FileInput/FileInput.tsx";
import {Mapa} from "./components/Map/Map.tsx";
import {Edge, Path, Pathing, Quadrant, Vertex} from "./interfaces/interfaces.ts";

function App() {

    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const [quadrants, setQuadrants] = useState<Quadrant[]>();

    const [pathing, setPathing] = useState<Path[]>([]);
    const [showPaths, setShowPaths] = useState<Pathing>(null);

  return (
      <>
          <h1>Projekt Algorytmy i Struktury danych</h1>
          <FileInput setVertices={setVertices} setEdges={setEdges} setPathing={setPathing} showPaths={showPaths}
                     setShowPaths={setShowPaths} setQuadrants={setQuadrants} areData={!(vertices.length || edges.length || quadrants?.length)}/>
          <Mapa vertices={vertices ?? []} edges={edges ?? []} quadrants={quadrants ?? []} pathing={pathing}
               showPaths={showPaths} setVertices={setVertices} setEdges={setEdges}/>

          <h3> Uniwersytet Mikołaja Kopernika w Toruniu 2025 <br/> Franciszek Kaniewski | Kacper Smolarczyk | Jarema
              Szyński</h3>
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
          <h5 style={{"margin": 0}}>Vite + React + Crow cpp</h5>
      </>
  )
}

export default App
