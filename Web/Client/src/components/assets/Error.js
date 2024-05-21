import { Link } from 'react-router-dom'

function Error() {
  const style = {
    textAlign: 'center',
  }

  return (
    <div style={style}>
      <h1>Error 404</h1>
      <h2>Page not found</h2>
      <button><Link to='/'>Home</Link></button>
    </div>
  )
}

export default Error
