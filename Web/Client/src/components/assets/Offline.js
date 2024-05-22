import { createPortal } from "react-dom"

const divStyle = {
  widows: "100%",
  display: "flex",
  justifyContent: "center",
}
const pStyle = {
  width: "25%",
  position: "fixed",
  top: "0",
  textAlign: "center",
  paddingTop: "3px",
  paddingBottom: "4px",
  backgroundColor: "red",
  zIndex: "100"
}

function Offline() {
  return createPortal(
    <div style={divStyle}>
      <p style={pStyle}>Vous êtes hors ligne !</p>
    </div>,
  document.body)
}

export default Offline
