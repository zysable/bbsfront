import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react'
import {API} from '@/config/env'

const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/post`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Posts', 'Post'],
  endpoints(builder) {
    return {
      getPosts: builder.query({
        query({cp, ps, q}) {
          return {
            url: `/posts?cp=${cp}&ps=${ps}&q=${q}`
          }
        },
        providesTags: ['Posts']
      }),
      getPost: builder.query({
        query(id) {
          return {
            url: `/${id}`
          }
        },
        providesTags: ['Post']
      }),
      createPost: builder.mutation({
        query(post) {
          return {
            url: '/create',
            method: 'POST',
            body: post
          }
        },
        invalidatesTags: ['Posts']
      }),
      editPost: builder.mutation({
        query({id, post}) {
          return {
            url: `/edit/${id}`,
            method: 'PATCH',
            body: post
          }
        },
        invalidatesTags: ['Post']
      }),
      deletePost: builder.mutation({
        query(id) {
          return {
            url: `/delete/${id}`,
            method: 'DELETE',
          }
        },
        invalidatesTags: ['Posts']
      }),
      uploadFile: builder.mutation({
        query(formData) {
          return {
            url: '/upload',
            method: 'POST',
            body: formData
          }
        }
      })
    }
  }
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useUploadFileMutation
} = postApi

export default postApi