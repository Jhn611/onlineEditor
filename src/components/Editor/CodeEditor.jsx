import { useState, useEffect, useRef } from 'react';
import './CodeEditor.css'
import Editor from "@monaco-editor/react";

function CodeEditor({code, setCode, isMobile}) {

  const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  
  const [editor, setEditor] = useState(null)
  const lastTouchY = useRef(0)

  useEffect(() => {
    if(!isMobile) return
    if(!editor) return

    const node = editor.getDomNode()
    if(!node) return

    const handleTouchStart = (event) => {
      lastTouchY.current = event.touches[0].clientY
    }

    const handleTouchMove = (event) => {
      const currentY = event.touches[0].clientY

      const deltaY = lastTouchY.current - currentY
      const scrollingDown = deltaY > 0
      const scrollingUp = deltaY < 0

      lastTouchY.current = currentY

      const scrollTop = editor.getScrollTop()
      const scrollHeight = editor.getScrollHeight()
      const visibleHeight = editor.getLayoutInfo().height

      const atTop = scrollTop <= 0
      const atBottom = scrollTop + visibleHeight >= scrollHeight - 1

      if((scrollingUp && atTop) || (scrollingDown && atBottom)){
        window.scrollBy({
          top: deltaY,
          behavior: "auto",
        })
      } 
    }

    node.addEventListener("touchstart", handleTouchStart, { passive: true });
    node.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
    };
  }, [editor, isMobile] )
  return (
    <div className='codeEditorWindow'>
      <Editor
      onMount={(editor) => setEditor(editor)}
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
            "editor.background": "#1e1e1ed6",
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
        fontSize: remToPx(isMobile ? 1.35 : 1.125),
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        scrollbar: {
          alwaysConsumeMouseWheel: !isMobile,
        },
        fixedOverflowWidgets: true,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        glyphMargin: false,
        lineDecorationsWidth: 0,
        lineNumbers: "on",
        padding: {
          top: 24,
          bottom: 24,
        },
      }}
    />
    </div>
  )
}

export default CodeEditor
