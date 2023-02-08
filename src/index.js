import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import {Provider} from 'react-redux'
import store from '@/store'
import '@/assets/styles/reset.css'
import '@/assets/styles/global.scss'
import '@/assets/styles/responesive.scss'
import Home from '@/pages/Home'
import MyLayout from '@/pages/MyLayout'
import Login from '@/pages/Login'
import ErrorPage from '@/pages/ErrorPage'
import EditUserInfo from './pages/EditUserInfo'
import CreatePost from './pages/CreatePost'
import Post from './pages/Post/[id]'
import EditPost from './pages/EditPost'
import Tools from './pages/Tools'

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <MyLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          }, {
            path: 'edit-user',
            element: <EditUserInfo />
          }, {
            path: 'create-post',
            element: <CreatePost />
          }, {
            path: 'post/:id',
            element: <Post />
          }, {
            path: 'post/edit/:id',
            element: <EditPost />
          }, {
            path: 'tools',
            element: <Tools />
          }
        ]
      },
      {
        path: 'login',
        element: <Login />
      },
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
)
