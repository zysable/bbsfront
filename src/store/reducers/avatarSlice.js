import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'avatar',
  initialState: () => {
    const avatarList = []
    for (let i = 0; i < 25; i++) {
      avatarList.push({
        avatarName: 'avatar' + i,
        avatarUrl: require(`@/assets/images/avatar${i}.webp`)
      })
    }
    return {
      avatarList
    }
  },
  reducers: {}
})

export default userSlice
