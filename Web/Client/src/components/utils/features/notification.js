import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  notificationItems: [],
  unread: 0,
}

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotification: (state) => {
      state.notificationItems = []
    },
  },
})

export const { clearNotification } = notificationSlice.actions

export default notificationSlice.reducer
