import { configureStore } from "@reduxjs/toolkit"
import notificationReducer from "../features/notification"

const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
})

export { store }
