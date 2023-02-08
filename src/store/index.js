import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/dist/query"
import userApi from "@/store/api/userApi"
import postApi from '@/store/api/postApi'
import replyApi from '@/store/api/replyApi'
import toolsApi from '@/store/api/toolsApi'
import userSlice from "@/store/reducers/userSlice"
import avatarSlice from '@/store/reducers/avatarSlice'

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [replyApi.reducerPath]: replyApi.reducer,
    [toolsApi.reducerPath]: toolsApi.reducer,
    user: userSlice.reducer,
    avatar: avatarSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    userApi.middleware,
    postApi.middleware,
    replyApi.middleware,
    toolsApi.middleware
  ),
  devTools: false
})

setupListeners(store.dispatch)

export default store