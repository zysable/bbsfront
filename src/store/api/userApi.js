import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react'
import {API} from '@/config/env'

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/user`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints(builder) {
    return {
      login: builder.mutation({
        query(user) {
          return {
            url: '/login',
            method: 'POST',
            body: user
          }
        }
      }),
      retrieveUser: builder.query({
        query() {
          return {
            url: '/retrieve'
          }
        },
        providesTags: ['User']
      }),
      updateUser: builder.mutation({
        query(user) {
          return {
            url: '/update',
            method: 'PATCH',
            body: user
          }
        },
        invalidatesTags: ['User']
      })
    }
  }
})

export const {
  useLoginMutation,
  useLazyRetrieveUserQuery,
  useUpdateUserMutation
} = userApi

export default userApi