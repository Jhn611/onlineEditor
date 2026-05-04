import { useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import "./App.css";
import CodeEditor from "./components/Editor/CodeEditor";
import Sandbox from "./components/IFrame/Sandbox";
import Button from "./components/Button/Button";
import Console from "./components/Console/Console";
import logo from "./assets/imgs/logo.PNG";
import copy from "./assets/imgs/Copy.svg"
import clbrd from "./assets/imgs/clipboard.svg"

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

  const readClipboard = (oldVariable, setVariableToCopy) => {
    navigator.clipboard.readText().then( value => setVariableToCopy(oldVariable + value)).catch(err => console.log(err))
  }
  
  const wtiteToClipoard = variableToCopy => {
    navigator.clipboard.writeText(variableToCopy)
  }

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
          <Button onClick={() => { if (window.confirm("Вы уверены, что хотите стереть ВЕСЬ код?")) { setCode(""); }}} btnStyle={"clearCodeButton"}>СТЕРЕТЬ КОД</Button>
        </div>
        <div className="consoleBlockButtons"> 
          <Button onClick={() => wtiteToClipoard(code)} btnStyle={"miniButton CopyButton"}><img src={copy} alt="" /> <p>КОПИРОВАТЬ КОД</p> </Button>
          <Button onClick={() => readClipboard(code, setCode)} btnStyle={"miniButton InsertButton"}><img src={clbrd} alt="" /> <p>ВСТАВИТЬ КОД</p> </Button>
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
          <p>JS online Editor v0.6</p>
          <p><span>Lines now: {code.split("\n").length}</span></p>
        </div>
      </footer>
    </>
  );
}

export default App;
