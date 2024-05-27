import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState, type FC, type PropsWithChildren } from 'react';

import "../styles/assets/Error.css"

type Code = "404" | "502" | "503"

type Props = PropsWithChildren<{
  action?: string,
  code: Code,
  path?: string,
}>

const containerVariants = {
  hidden: { opacity: 0, x: "100vw" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 120, delay: 0.2 }
  },
  exit: {
    opacity: 0,
    x: "-100vw",
    transition: { ease: "easeInOut" }
  }
}

const textVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 1.5, duration: 1.5 }
  }
}

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: { yoyo: Infinity }
  }
}

const message = {
  "404": "L'URL que vous avez spécifier n'existe pas",
  "502": "La réponse du serveur n'est pas valide",
  "503": "Cette ressource n'est pas disponible",
}

const Error: FC<Props> = ({ action, code, path = "/", children = "Accueil" }) => {
  const [ visible, setVisible ] = useState(false)

  const navigate = () => {
    setVisible(false)
    setTimeout(() => {
      if (action === "reload")
        window.location.reload()
      else
        window.location.replace(path)
    }, 500);
  }

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <AnimatePresence>
      {visible &&
      (<motion.div
        className="error-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.h1 className="error-header" variants={textVariants}>{code}</motion.h1>
        <motion.p className="error-paragraph" variants={textVariants}>{message[code]}</motion.p>
        <motion.div variants={textVariants}>
          <motion.button className="error-button" variants={buttonVariants} whileHover="hover" onClick={navigate}>
            {children}
          </motion.button>
        </motion.div>
      </motion.div>)}
      </AnimatePresence>
  )
}

export default Error
