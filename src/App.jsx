import { useEffect, useState } from "react";
import "./App.css";
import CodeEditor from "./components/Editor/CodeEditor";
import Sandbox from "./components/IFrame/Sandbox";
import Button from "./components/Button/Button";
import Console from "./components/Console/Console";

function App() {
  const [code, setCode] = useState(localStorage.getItem("code") || "");
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);
 useEffect(() => {
    console.log(logs, isRunning)
  }, [logs, isRunning]);
  return (
    <>
      <header></header>
      <main>
        <CodeEditor code={code} setCode={setCode} />
        <div className="consoleBlock">
           <Console logs={logs} />
           <div className="consoleBlockButtons">
            <Button onClick={() => setIsRunning(true)} btnStyle={"runButton"}>ЗАПУСТИТЬ</Button>
            <Button onClick={() => setLogs([])} btnStyle={"clearButton"}>ОЧИСТИТЬ</Button>
           </div>
        </div>
      </main>

      <Sandbox
        code={code}
        shouldRun={isRunning}
        onLog={(log) => 
          setLogs((prev) => [...prev, log])
        }
        onFinish={() => setIsRunning(false)}
      />

      <footer></footer>
    </>
  );
}

export default App;
