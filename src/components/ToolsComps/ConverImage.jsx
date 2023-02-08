import React from 'react'
import {Upload, Button, message} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {useState} from 'react'
import {useConvertImageMutation} from '../../store/api/toolsApi'
import {useDispatch} from 'react-redux'
import {logout} from '@/store/reducers/userSlice'

export default function ConverImage() {

  const [covertImgFn] = useConvertImageMutation()
  const dispatch = useDispatch()

  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
  const handleUpload = async () => {
    setUploading(true)
    try {
      for (const file of fileList) {
        const formData = new FormData()
        formData.append('file', file.originFileObj)
        const res = await covertImgFn(formData)
        if (res.data.code === 401) {
          message.error(res.msg)
          return dispatch(logout())
        }
        if (res.data.code !== 200) throw new Error(res.msg)
        const hiddenElement = document.createElement('a')
        const blobImg = res.data.url
        hiddenElement.href = blobImg
        hiddenElement.target = '_blank'
        hiddenElement.download = `${res.data.filename}`
        hiddenElement.click()
        hiddenElement.remove()
      }
      setFileList([])
      setUploading(false)
    } catch (error) {
      console.error(error)
    }

  }

  const props = {
    onChange: info => {
      const isPic = ['image/png', 'image/jpeg', 'image/gif'].includes(info.file.type)
      if (!isPic) return message.error(`${info.file.name} 不是合法的 png / jpeg / gif 文件！`)
      const isSizeRight = info.file.size < 2 * 1024 * 1024
      if (!isSizeRight) return message.error(`${info.file.name} 文件大小已经超过 2MB ！`)
      let newFileList = [...info.fileList]
      newFileList = newFileList.slice(-3)
      setFileList(newFileList)
    },
    beforeUpload: () => {
      return false
    },
    fileList,
    multiple: true
  }
  return (
    <>
      <p style={{fontWeight: 'bold', color: 'red'}}>文件大小不超过2MB, 一次最多3个文件</p>
      <Upload {...props}>
        <Button icon={<UploadOutlined />} size="large">上传png/jpg/gif文件</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
        size="large"
      >
        {uploading ? '上传中...' : '上传转换'}
      </Button>
    </>
  )
}
