import { motion } from "framer-motion"

import "../styles/Error.css"

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
  "503": "Cette ressource n'est pas disponible",
}

function Error({ action, code, path = "/", children = "Accueil" }) {
  const navigate = () => {
    if (action === "reload")
      window.location.reload()
    else
      window.location.replace(path)
  }

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 className="header" variants={textVariants}>{code}</motion.h1>
      <motion.p className="paragraph" variants={textVariants}>{message[code]}</motion.p>
      <motion.div variants={textVariants}>
        <button onClick={navigate}>
          <motion.button className="button" variants={buttonVariants} whileHover="hover">{children}</motion.button>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default Error
