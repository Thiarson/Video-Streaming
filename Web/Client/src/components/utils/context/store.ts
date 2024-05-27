import { configureStore } from "@reduxjs/toolkit"
import notificationReducer from "../features/notification"
import modalReducer from "../features/modal"

const store = configureStore({
  reducer: {
    modal: modalReducer,
    notification: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export { store }
