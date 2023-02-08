import React, {useCallback, useMemo, useRef} from 'react'
import ReactQuill, {Quill} from 'react-quill'
import ImageResize from 'quill-image-resize-module-react'
import 'react-quill/dist/quill.snow.css'
import {useDispatch} from 'react-redux'
import {message} from 'antd'
import {logout} from '@/store/reducers/userSlice'
import {useUploadFileMutation} from '../../store/api/postApi'
import './my-quill.scss'

Quill.register('modules/imageResize', ImageResize)

const formats = [
  'bold', 'italic', 'underline', 'strike',
  'script',
  'color', 'background', 'blockquote',
  'indent', 'align',
  'list',
  'link', 'image', 'video'
]

export default function MyQuill(props) {

  const dispatch = useDispatch()
  const [uploadFn] = useUploadFileMutation()

  const quillRef = useRef()

  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      const formData = new FormData()

      formData.append('image', file)
      try {
        const {data} = await uploadFn(formData)
        if (data.code === 401) {
          message.error(data.msg)
          return dispatch(logout())
        }
        if (data.code !== 200) throw new Error(data.msg)
        let quill = quillRef?.current?.getEditor()
        const cursorPosition = quill.getSelection().index
        const link = data.data.url
        quill.insertEmbed(cursorPosition, 'image', link)
        quill.setSelection(cursorPosition + 1)
      } catch (e) {
        console.error(e)
      }
    }
  }, [dispatch, uploadFn])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{'script': 'sub'}, {'script': 'super'}],
          [{'color': []}, {'background': []}, 'blockquote'],
          [{'indent': '-1'}, {'indent': '+1'}],
          [{'align': []}],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link', 'image', 'video'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      },
      clipboard: {
        matchVisual: false
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
      }
    }), [imageHandler]
  )

  return (
    <>
      <ReactQuill ref={quillRef} theme="snow" value={props.content} onChange={props.setContent}
        modules={modules} formats={formats} />
    </>
  )
}
