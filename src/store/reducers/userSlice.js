import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: 'user',
  initialState: () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    return {
      isLogged: token ? true : false,
      uid: null,
      username: null,
      avatar: null
    }
  },
  reducers: {
    login(state, action) {
      state.isLogged = true
      if (action.payload.remember) {
        sessionStorage.removeItem('token')
        localStorage.setItem('token', action.payload.token)
      }
      else {
        localStorage.removeItem('token')
        sessionStorage.setItem('token', action.payload.token)
      }
    },
    saveUser(state, action) {
      state.uid = action.payload.uid
      state.username = action.payload.username
      state.avatar = action.payload.avatar
    },
    logout(state) {
      state.isLogged = false
      state.uid = null
      state.username = null
      state.avatar = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    },
  }
})

export const {login, logout, saveUser} = userSlice.actions

export default userSlice