import './CodeEditor.css'
import Editor from "@monaco-editor/react";

function CodeEditor({code, setCode}) {

  const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

  return (
    <div className='codeEditorWindow'>
      <Editor
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("my-theme", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "", foreground: "a3ffa3ff" },
            { token: "keyword", foreground: "5c816bff" },
            { token: "string", foreground: "eed876ff" },
            { token: "comment", foreground: "8189cfff" },
            { token: "number", foreground: "c0ddf1ff" },
          ],
          colors: {
            "editor.foreground": "#c0ddf1ff",
            "editor.background": "#1e1e1ee2",
            "editorCursor.foreground": "#b9f8b9ff",
            // "editor.lineHighlightBackground": "#f5f5f5",
            // "editor.selectionBackground": "#cce8ff",
            // "editorLineNumber.foreground": "#999999",
            // "editorLineNumber.activeForeground": "#333333",
          },
        });
      }}
      theme="my-theme"
      height="100%"
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{
        fontSize: remToPx(1.125),
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        glyphMargin: false,
        lineDecorationsWidth: 0,
        lineNumbers: "on",
        padding: {
          top: 24,
        },
      }}
    />
    </div>
  )
}

export default CodeEditor
