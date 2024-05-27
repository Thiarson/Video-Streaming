import { PropsWithChildren, useEffect, useState, type FC } from 'react';

type Props = PropsWithChildren<{
  start: number,
  stop: boolean,
  finish: string,
  onTimeout: Function
}>

const Countdowm: FC<Props> = ({ start, stop, finish, onTimeout, children }) => {
  const [ timeLeft, setTimeLeft ] = useState(start)
  const message = timeLeft <= 0 ? finish : `${children} ${timeLeft}`    

  useEffect(() => {    
    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 0) {
          onTimeout()
          clearInterval(timer)

          return time
        } else if (stop) {
          clearInterval(timer)
          time = 0

          return time
        }

        return --time
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [stop])

  return (
    <p>{message}</p>
  )
}

export default Countdowm
