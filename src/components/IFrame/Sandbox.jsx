import { useEffect, useRef } from "react";
import "./Sandbox.css"

function Sandbox({ code, shouldRun, onLog, onFinish }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!shouldRun) return;

    const iframe = document.createElement("iframe");

    iframe.sandbox = "allow-scripts";
    iframe.style.display = "none";

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            const send = (level, args) => {
              parent.postMessage({
                source: "sandbox",
                level,
                args
              }, "*");
            };

            console.log = (...args) => send("log", args);
            console.warn = (...args) => send("warn", args);
            console.error = (...args) => send("error", args);

            window.onerror = (message) => {
              send("error", [message]);
            };

            window.addEventListener("message", (event) => {
              if (!event.data || event.data.type !== "run") return;

              try {
                new Function(event.data.code)();
                send("finish", ["Execution finished"]);
              } catch (error) {
                send("error", [error.message]);
              }
            });
          </script>
        </body>
      </html>
    `;

    iframeRef.current = iframe;
    document.body.appendChild(iframe);
    const handleObject = (obj, level) => {
      let thisLevelString = ''
      for(let key in obj){  
        if(Array.isArray(obj[key])) return thisLevelString + '\n' + level + `${key}: [` + handleObject(obj[key], level + '  ') + ']'
        if(typeof(obj[key]) == 'object') return thisLevelString + '\n' + level + `${key}: {` + handleObject(obj[key], level + '  ') + '}'
        else thisLevelString += '\n' + level + `${key}: ${obj[key]}`
      }
      return thisLevelString
    }
    const handleMessage = (event) => {
      if (event.source !== iframe.contentWindow) return;
      if (!event.data || event.data.source !== "sandbox") return;

      if (event.data.level === "finish") {
        onFinish?.();
        return;
      }
      console.log(event.data);
      onLog?.({
        type: event.data.level,
        text: event.data.args.map((i) => {
          if(Array.isArray(i)){
            return '[' + handleObject(i, '') + ']'
          }
          else if(typeof(i) == 'object'){
            return '{' + handleObject(i, '') + '}'
          }else{
            return String(i)
          }
        }).join(" "),
      });
    };

    window.addEventListener("message", handleMessage);

    const timeout = setTimeout(() => {
      onLog?.({
        type: "error",
        text: "Execution timeout",
      });

      onFinish?.();
      iframe.remove();
    }, 3000);

    iframe.onload = () => {
      iframe.contentWindow.postMessage(
        {
          type: "run",
          code,
        },
        "*"
      );
    };

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", handleMessage);

      if (iframeRef.current) {
        iframeRef.current.remove();
        iframeRef.current = null;
      }
    };
  }, [shouldRun, code, onLog, onFinish]);

  return null;
}

export default Sandbox
