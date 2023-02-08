import React, {useEffect} from 'react'
import {message} from 'antd'
import {Navigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useLazyRetrieveUserQuery} from '@/store/api/userApi'
import postApi from '@/store/api/postApi'
import {logout, saveUser} from '@/store/reducers/userSlice'

export default function AuthComponent({children}) {

  const user = useSelector(state => state.user)
  const [retrieveUserFn] = useLazyRetrieveUserQuery()
  const dispatch = useDispatch()

  useEffect(() => {
    retrieveUserFn().then(({data}) => {
      if (data.code === 401) {
        if (localStorage.getItem('token') || sessionStorage.getItem('token')) message.error(data.msg)
        dispatch(postApi.util.resetApiState())
        dispatch(logout())
      } else {
        if (data.code === 200) dispatch(saveUser(data.data))
        else console.error(data.msg)
      }
    }).catch(console.error)
    // eslint-disable-next-line
  }, [])

  if (user.isLogged) return children
  else return <Navigate to="/login" replace={true} />
}
