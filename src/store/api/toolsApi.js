import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react'
import {API} from '@/config/env'

const toolsApi = createApi({
  reducerPath: 'toolsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API}/tools`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints(builder) {
    return {
      convertImage: builder.mutation({
        query(file) {
          return {
            url: '/convert-image',
            method: 'POST',
            body: file,
            responseHandler: async (response) => {
              const contentType = response.headers.get('Content-Type')
              if (contentType.includes('application/json')) return await response.json()
              const fileBlob = await response.blob()
              const filename = response.headers.get('x-filename')
              return {url: URL.createObjectURL(fileBlob), filename, code: 200}
            },
            cache: "no-cache",
          }
        },
      }),
    }
  }
})

export const {
  useConvertImageMutation
} = toolsApi

export default toolsApi