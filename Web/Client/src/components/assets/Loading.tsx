import Spinner from "./Spinner"

import "../styles/assets/Loading.css"

function Loading() {
  return (
    <div className="loading">
      <Spinner/>
      <h1>Please Wait !</h1>
    </div>
  )
}

export default Loading
