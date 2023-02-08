import {Button, Card, Col, Input, message, Row, Popconfirm} from 'antd'
import React, {useState} from 'react'
import MyQuill from '../../components/MyQuill'
import {useCreatePostMutation} from '../../store/api/postApi'
import {useDispatch} from 'react-redux'
import {logout} from '@/store/reducers/userSlice'
import {useNavigate} from 'react-router-dom'

export default function CreatePost() {

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [content, setContent] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [createPostFn] = useCreatePostMutation()
  const handlePost = async () => {
    if (!title.trim()) return message.error('标题不能为空！')
    if (!desc.trim()) return message.error('摘要不能为空！')
    if (!content || content === '<p><br></p>') {
      setContent('')
      return message.error('文章内容不能为空！')
    }
    const postBody = {
      title,
      desc,
      content,
      v_count: 0,
      r_count: 0,
      last_cid: '',
    }
    try {
      const {data: res} = await createPostFn(postBody)
      if (res.code === 401) {
        message.error(res.msg)
        return dispatch(logout())
      }
      if (res.code !== 200) throw new Error(res.msg)
      navigate('/', {replace: true})
    } catch (e) {
      console.error(e)
    }
  }

  const confirm = () => {
    handlePost()
  }
  const cancel = () => {
    return
  }

  return (
    <div className="create-post">
      <Card>
        <Row gutter={20} align="middle">
          <Col>
            <span><i>*</i>文章标题</span>
          </Col>
          <Col xs={15}>
            <Input size="large" placeholder="输入文章标题"
              value={title} onChange={e => setTitle(e.target.value)} />
          </Col>
        </Row>
        <Row gutter={20} align="middle" className="middle">
          <Col>
            <span><i>*</i>文章提要</span>
          </Col>
          <Col xs={15}>
            <Input size="large" placeholder="输入文章摘要"
              value={desc} onChange={e => setDesc(e.target.value)} />
          </Col>
        </Row>
        <Col>
        </Col>
        <Row>
          <Col xs={24}>
            <span className="content"><i>*</i>文章内容</span>
            <MyQuill setContent={setContent} content={content} />
          </Col>
          <Col xs={24} className="btn-wrapper">
            <Popconfirm
              title="确定发布？"
              description="确定发布新文章？"
              onConfirm={confirm}
              onCancel={cancel}
              okText="是"
              cancelText="否"
            >
              <Button type="primary" size="large">发布文章</Button>
            </Popconfirm>

          </Col>
        </Row>
      </Card>
    </div>
  )
}
