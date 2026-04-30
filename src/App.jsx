import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import "./App.css";
import CodeEditor from "./components/Editor/CodeEditor";
import Sandbox from "./components/IFrame/Sandbox";
import Button from "./components/Button/Button";
import Console from "./components/Console/Console";
import logo from "./assets/imgs/logo.PNG";

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
      <header>
        <img src={logo} alt="" />
        <div className="headerText">
          <h1>JavaScript online Editor</h1>
        </div>
      </header>
      <main>
        <Group orientation={window.innerWidth > 525 ? "horizontal" : "vertical"} className="panels">
          <Panel defaultSize={window.innerWidth > 525 ? 60 : 40} minSize={25}>
            <div className="panelInner">
              <CodeEditor code={code} setCode={setCode} />
            </div>
          </Panel>

          <Separator className="resizeHandle" />

          <Panel defaultSize={window.innerWidth > 525 ? 20 : 20} minSize={20}>
            <div className="panelInner">
              <div className="consoleBlock">
                <Console logs={logs} />
                <div className="consoleBlockButtons">
                  <Button onClick={() => setIsRunning(true)} btnStyle={"runButton"}>ЗАПУСТИТЬ</Button>
                  <Button onClick={() => setLogs([])} btnStyle={"clearButton"}>ОЧИСТИТЬ</Button>
                </div>
              </div>
            </div>
          </Panel>
        </Group>
      </main>

      <Sandbox
        code={code}
        shouldRun={isRunning}
        onLog={(log) => 
          setLogs((prev) => [...prev, log])
        }
        onFinish={() => setIsRunning(false)}
      />

      <footer>
        <div className="footerText">
          <p>© 2026 Jhn</p>
          <p>JS online Editor v0.4</p>
          <p><span>Lines now: {code.split("\n").length}</span></p>
        </div>
      </footer>
    </>
  );
}

export default App;
