import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  codeVerif: {
    isOpen: false,
  },
}

type ModalKey = keyof typeof initialState
type SliceState = typeof initialState

const handleOpenModal = (state: SliceState, action: { type: string, payload: ModalKey }) => {
  const key = action.payload
  state[key].isOpen = true
}

const handleCloseModal = (state: SliceState, action: { type: string, payload: ModalKey }) => {
  const key = action.payload
  state[key].isOpen = false
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
  },
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
