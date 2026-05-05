import './Alert.css'


function Alert({children, alertStyle, style}) {
  return (
    <div className={alertStyle + " customAlert"} style={style}>{children}</div>
  )
}

export default Alert
