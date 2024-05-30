import { configureStore } from "@reduxjs/toolkit"
import modalReducer from "../features/modal"

const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export { store }
