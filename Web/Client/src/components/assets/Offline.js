const divStyle = {
  widows: "100%",
  display: "flex",
  justifyContent: "center",
}
const pStyle = {
  position: "fixed",
  width: "25%",
  textAlign: "center",
  backgroundColor: "red",
}

function Offline() {
  return (
    <div style={divStyle}>
      <p style={pStyle}>Vous êtes hors ligne !</p>
    </div>
  )
}

export default Offline
