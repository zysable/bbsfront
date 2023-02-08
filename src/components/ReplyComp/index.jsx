import React, {useCallback, useState} from 'react'
import {Row, Col, Avatar, Button, Input, Spin, message} from 'antd'
import './reply.scss'
import {useDispatch, useSelector} from 'react-redux'
import {useCreateReplyMutation} from '../../store/api/replyApi'
import postApi from '../../store/api/postApi'
import {logout} from '@/store/reducers/userSlice'

const {TextArea} = Input

export default function ReplyComp(props) {

  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [createReplyFn] = useCreateReplyMutation()
  const dispatch = useDispatch()

  const postComment = () => {
    if (!comment.trim()) return message.error('不能回复空内容！')
    createReplyFn({
      comment,
      uid: user.uid,
      pid: props.pid,
    }).then(({data}) => {
      if (data.code === 401) {
        message.error(data.msg)
        return dispatch(logout())
      }
      if (data.code !== 200) throw new Error(data.msg)
      setComment('')
      message.success('添加回复成功！')
      dispatch(postApi.util.invalidateTags(['Posts']))
    }).catch(console.error)

  }
  const cancelComment = useCallback(() => {
    setComment('')
  }, [])
  return (
    <div className="reply-comp">
      <Row justify="space-between">
        <Col xs={2} className="author-wrapper">
          {user.avatar ? <Avatar src={require(`@/assets/images/${user.avatar}.webp`)} size={50} /> : <Spin />}
          <p className="name">{user.username}</p>
        </Col>
        <Col xs={20} sm={20} md={21} lg={22} className="text-wrapper">
          <TextArea
            showCount
            maxLength={300}
            style={{
              height: 80,
              resize: 'none',
            }}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="输入评论..."
          />
          <div className="btn-wrapper">
            <Button type="primary" ghost onClick={postComment}>
              回复
            </Button>
            <Button danger onClick={cancelComment}>
              取消
            </Button>
          </div>
        </Col>
      </Row>
    </div >
  )
}
