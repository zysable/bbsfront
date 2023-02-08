import React, {useCallback, useMemo, useRef} from 'react'
import ReactQuill, {Quill} from 'react-quill'
import ImageResize from 'quill-image-resize-module-react'
import QuillImageDropAndPaste, {ImageData} from 'quill-image-drop-and-paste'
import 'react-quill/dist/quill.snow.css'
import {useDispatch} from 'react-redux'
import {message} from 'antd'
import {logout} from '@/store/reducers/userSlice'
import {useUploadFileMutation} from '../../store/api/postApi'
import './my-quill.scss'

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)

const formats = [
  'bold', 'italic', 'underline', 'strike',
  'script',
  'color', 'background', 'blockquote',
  'list',
  'link', 'image', 'video'
]

export default function MyQuill(props) {

  const dispatch = useDispatch()
  const [uploadFn] = useUploadFileMutation()

  const quillRef = useRef()

  const pasteImageHandler = async (dataUrl, type, imageData) => {
    const file = imageData.toFile()
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

  const imageHandler = useCallback(() => {
    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.setAttribute('accept', 'image/*')

    fileInput.click()

    fileInput.onchange = (e) => {
      const files = e.target.files
      let file
      if (files.length > 0) {
        file = files[0]
        const type = file.type
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target.result
          pasteImageHandler(dataUrl, type, new ImageData(dataUrl, type, file.name))
          fileInput.value = ''
        }
        reader.readAsDataURL(file)
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
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link', 'image', 'video'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      },
      imageDropAndPaste: {
        handler: pasteImageHandler
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
