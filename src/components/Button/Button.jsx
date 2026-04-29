import './Button.css'


function Button({children, onClick, btnStyle}) {
  return (
    <button onClick={onClick} className={btnStyle + " customButton"}>{children}</button>
  )
}

export default Button
