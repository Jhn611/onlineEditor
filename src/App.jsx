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
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 525);

  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 525px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    console.log(logs, isRunning)
  }, [logs, isRunning]);

  const editorPanel = (
    <div className="panelInner">
      <CodeEditor code={code} setCode={setCode} />
    </div>
  );

  const consolePanel = (
    <div className="panelInner">
      <div className="consoleBlock">
        <Console logs={logs} />
        <div className="consoleBlockButtons">
          <Button onClick={() => setIsRunning(true)} btnStyle={"runButton"}>ЗАПУСТИТЬ</Button>
          <Button onClick={() => setLogs([])} btnStyle={"clearButton"}>ОЧИСТИТЬ</Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header>
        <img src={logo} alt="" />
        <div className="headerText">
          <h1>JavaScript online Editor</h1>
        </div>
      </header>
      <main>
        {isMobile ? (
          <div className="mobilePanels">
            {editorPanel}
            {consolePanel}
          </div>
        ) : (
          <Group orientation="horizontal" className="panels">
            <Panel defaultSize={60} minSize={25}>
              {editorPanel}
            </Panel>

            <Separator className="resizeHandle" />

            <Panel defaultSize={20} minSize={20}>
              {consolePanel}
            </Panel>
          </Group>
        )}
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
          <p>JS online Editor v0.413</p>
          <p><span>Lines now: {code.split("\n").length}</span></p>
        </div>
      </footer>
    </>
  );
}

export default App;
