import './Console.css'


function Console({ logs }) {
  return (
    <div className="console">
      <div className="consoleHeader">Console</div>

      <div className="consoleBody">
        {logs.length === 0 ? (
          <div className="consoleEmpty">No output</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`consoleLine ${log.type}`}>
              {log.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Console
