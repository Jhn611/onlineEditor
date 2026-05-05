import { useCallback, useEffect, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import "./App.css";
import CodeEditor from "./components/Editor/CodeEditor";
import Sandbox from "./components/IFrame/Sandbox";
import Button from "./components/Button/Button";
import Console from "./components/Console/Console";
import Alert from "./components/Alert/Alert";
import logo from "./assets/imgs/logo.PNG";
import copy from "./assets/imgs/Copy.svg"
import clbrd from "./assets/imgs/Clipboard.svg"
import play from "./assets/imgs/Play.svg"
import trash from "./assets/imgs/Trash.svg"


function App() {
  const [code, setCode] = useState(localStorage.getItem("code") || "");
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 525);
  const [copied, setCopied] = useState(false)
  const [inserted, setInserted] = useState(false)
  const [lastAction, setLastAction] = useState(null);

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

  const handleLog = useCallback((log) => setLogs((prev) => [...prev, log]), [])
  const handleFinish = useCallback(() => setIsRunning(false), [])

  const readClipboard = (oldVariable, setVariableToCopy) => {
    navigator.clipboard.readText().then( value => setVariableToCopy(oldVariable + value)).catch(err => console.log(err))
    setInserted(true)
    setLastAction("inserted")
    setTimeout(() => setInserted(false), 1500)
  }
  
  const wtiteToClipoard = variableToCopy => {
    navigator.clipboard.writeText(variableToCopy)
    setCopied(true)
    setLastAction("copied")
    setTimeout(() => setCopied(false), 1500)
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
          <Button onClick={() => setIsRunning(true)} btnStyle={"runButton"}><img src={play} alt="" /> <p>ЗАПУСТИТЬ</p></Button>
          <Button onClick={() => setLogs([])} btnStyle={"clearButton"}>ОЧИСТИТЬ</Button>
          <Button onClick={() => { if (window.confirm("Вы уверены, что хотите стереть ВЕСЬ код?")) { setCode(""); }}} btnStyle={"clearCodeButton"}> <img src={trash} alt="" /> <p>СТЕРЕТЬ КОД</p></Button>
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
    <Alert alertStyle={`copiedAlert ${copied ? "show" : "hide"}`} style={{ zIndex: lastAction === "copied" ? 10 : 1}}>Код был скопирован в буфер обмена</Alert>
    <Alert alertStyle={`insertedAlert ${inserted ? "show" : "hide"}`} style={{ zIndex: lastAction === "inserted" ? 10 : 1}}>Код был вставлен из буфера обмена</Alert>
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
            <Panel defaultSize={window.innerWidth <= 1800 && !isMobile ? 50 : 60} minSize={25}>
              {editorPanel}
            </Panel>

            <Separator className="resizeHandle" />

            <Panel defaultSize={window.innerWidth <= 1800 && !isMobile ? 32 : 20} minSize={20}>
              {consolePanel}
            </Panel>
          </Group>
        )}
      </main>

      <Sandbox
        code={code}
        shouldRun={isRunning}
        onLog={handleLog}
        onFinish={handleFinish}
      />

      <footer>
        <div className="footerText">
          <p>© 2026 Jhn</p>
          <p>JS online Editor v1.3</p>
          <p><span>Lines now: {code.split("\n").length}</span></p>
        </div>
        <div className="footerText">
          <p>Ограничение времени выполнения 4.5сек./4500мс.</p>
          <p>В случае возникновении ошибки(ок) будет выведена только первая.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
