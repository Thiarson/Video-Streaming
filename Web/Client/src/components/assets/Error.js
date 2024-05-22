const style = { textAlign: 'center' }

function Error({ action, code = "404", message = "Page not found", path = "/", children = "Home" }) {
  const navigate = () => {
    if (action === "reload")
      window.location.reload()
    else
      window.location.replace(path)
  }
  
  return (
    <div style={style}>
      <h1>Error {code}</h1>
      <h2>{message}</h2>
      <button onClick={navigate}>{children}</button>
    </div>
  )
}

export default Error
