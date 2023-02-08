import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react'
import {API} from '@/config/env'

const replyApi = createApi({
  reducerPath: 'replyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/reply`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Replies', 'Reply'],
  endpoints(builder) {
    return {
      getReplies: builder.query({
        query({cp, ps, pid}) {
          return {
            url: `/replies?cp=${cp}&ps=${ps}&pid=${pid}`
          }
        },
        providesTags: ['Replies']
      }),
      createReply: builder.mutation({
        query(reply) {
          return {
            url: '/create',
            method: 'POST',
            body: reply
          }
        },
        invalidatesTags: ['Replies']
      }),
      deleteReply: builder.mutation({
        query(cid) {
          return {
            url: `/delete/${cid}`,
            method: 'DELETE',
          }
        },
        invalidatesTags: ['Replies']
      })
    }
  }
})

export const {
  useGetRepliesQuery,
  useCreateReplyMutation,
  useDeleteReplyMutation
} = replyApi

export default replyApi