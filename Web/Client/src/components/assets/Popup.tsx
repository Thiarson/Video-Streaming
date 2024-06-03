import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import type { FC, PropsWithChildren } from "react"
import type { MotionStyle } from "framer-motion"

type Style = {
  popup: MotionStyle,
}

type PopupKey = keyof typeof popup

type Props = PropsWithChildren<{
  type: PopupKey,
}>

const popup = {
  offline: {
    message: "Vous êtes hors ligne !",
    styles: {
      backgroundColor: "#e74c3c",
    },
  },
  success: {
    message: "Effectué avec succès !",
    styles: {
      backgroundColor: "green",
    }
  }
}

const styles: Style = {
  popup: {
    position: "fixed",
    top: 3,
    width: "350px",
    textAlign: "center",
    // backgroundColor: "#e74c3c",
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

const Popup: FC<Props> = ({ type, children }) => {
  const popupStyles = {
    ...styles.popup,
    ...popup[type].styles,
  }

  return createPortal(
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <motion.div
        style={popupStyles}
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children ?? popup[type].message}
      </motion.div>
    </div>,
  document.body)
}

export default Popup
