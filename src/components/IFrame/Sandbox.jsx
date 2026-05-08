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

            let finished = false;
            const finish = () => {
              if (finished) return;
              finished = true;
              send("finish", ["Execution finished"]);
            };
            let hasError = false;
            window.onerror = (message) => {
              if (hasError) return;
              hasError = true;
              send("error", [message]);
            };

            const originalSetTimeout = window.setTimeout;
            const originalClearTimeout = window.clearTimeout;
            let pendingTimers = 0;
            const activeTimers = new Set();
            let finishCheckId = null;

            const checkFinishCheck = () => {
              if (finishCheckId !== null) {
                originalClearTimeout(finishCheckId);
              }

              finishCheckId = originalSetTimeout(() => {
                finishCheckId = null;

                if(pendingTimers === 0){
                  finish();
                }  
              }, 0);
            };

            const tryFinish = () => {
              if(pendingTimers === 0){
                checkFinishCheck();
              }  
            };

            window.addEventListener("unhandledrejection", (event) => {
              if (hasError) return;
              hasError = true;
              send("error", [event.reason?.message || event.reason]);
              finish();
            });

            window.addEventListener("error", (event) => {
              if (hasError) return;
              hasError = true;
              send("error", [event.message]);
              finish();
            });

            const runUserCode = (code) => {
              try {
                new Function(code)();
                tryFinish();
              } catch (error) {    
                if (!hasError) {
                  hasError = true;
                  send("error", [error.message]);       
                }
                finish();
              }
            };

            window.setTimeout = (callback, delay, ...args) => {
              pendingTimers++;
              const id = originalSetTimeout(() => {
                  activeTimers.delete(id);
                  try{
                    callback(...args);
                  } catch(error){
                   if (hasError) return;
                   hasError = true;
                   send("error", [error.message]);
                  } finally {
                   pendingTimers--;
                   tryFinish();
                  }
                }, delay);

              activeTimers.add(id);
              return id;
            };

            window.clearTimeout = (id) => {
              if(activeTimers.has(id)){
                activeTimers.delete(id);
                pendingTimers--;
              }
              originalClearTimeout(id);
              tryFinish();
            }

            window.addEventListener("message", (event) => {
              if (!event.data || event.data.type !== "run") return;
              runUserCode(event.data.code);
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
          if (i === null) {
            return "null"
          }
          else if(Array.isArray(i)){
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
    }, 4500);

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
