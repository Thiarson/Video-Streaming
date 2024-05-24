import { createPortal } from "react-dom"
import { motion } from "framer-motion"

const styles = {
  popup: {
    position: "fixed",
    top: 3,
    width: "350px",
    textAlign: "center",
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "3px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
}

const popupVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
}

function Offline() {
  return createPortal(
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <motion.div
        style={styles.popup}
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        Vous êtes hors ligne !
      </motion.div>
    </div>,
  document.body)
}

export default Offline
