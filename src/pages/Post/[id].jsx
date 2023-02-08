import {Card, Row, Col, Avatar, Skeleton, Button, Popconfirm, Spin, message} from 'antd'
import {HighlightOutlined, DeleteOutlined} from '@ant-design/icons'
import React from 'react'
import ReactQuill from 'react-quill'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import postApi, {useGetPostQuery, useDeletePostMutation} from '../../store/api/postApi'
import {logout} from '@/store/reducers/userSlice'
import ReplyComp from '@/components/ReplyComp'
import ReplyList from '@/components/ReplyList'

export default function Post() {

  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {id} = useParams()

  const {data, isSuccess} = useGetPostQuery(id)
  const [deletePostFn] = useDeletePostMutation()

  const goEditPost = ({title, desc, content}) => {
    navigate(`/post/edit/${id}`, {state: {title, desc, content}})
  }

  const confirm = async () => {
    try {
      const {data: res} = await deletePostFn(id)
      console.log(res)
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
  const cancel = () => {
  }

  return (
    <div className="get-post">
      {
        isSuccess && data.code === 200 ?
          <Card className="post-content">
            <Row gutter={10}>
              <Col xs={0} sm={3} className="author-wrapper">
                {data.data?.user_avatar ? <Avatar src={require(`@/assets/images/${data.data.user_avatar}.webp`)} size={60} /> : <Spin />}
                <p className="name">{data.data.username}</p>
              </Col>
              <Col xs={24} sm={21} className="content-wrapper">
                <h1 className="title">{data.data.title}</h1>
                <h2 className="desc">{data.data.desc}</h2>
                <div className="content">
                  <ReactQuill value={data.data.content} readOnly={true} theme="bubble" />
                </div>
                <div className="operation">
                  <Row gutter={[30, 10]} justify="end" align="middle">
                    <Col>
                      {
                        data.data.lastModified ?
                          <span style={{fontSize: '14px', color: '#6c757d', fontWeight: 'bold'}}>
                            更新于 {new Date(data.data.lastModified).toLocaleString('zh-CN')}
                          </span> :
                          <span style={{fontSize: '14px', color: '#6c757d', fontWeight: 'bold'}}>
                            发布于 {new Date(data.data.createdAt).toLocaleString('zh-CN')}
                          </span>
                      }
                    </Col>
                    <Col>
                      <Popconfirm
                        placement="bottom"
                        title="删除文章"
                        description="删除此文章会一并删除所有回复，是否删除？"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="是"
                        cancelText="否"
                        disabled={user.uid !== data.data.uid}
                      >
                        <Button danger disabled={user.uid !== data.data.uid} icon={<DeleteOutlined />}>
                          删除
                        </Button>
                      </Popconfirm>
                    </Col>
                    <Col>
                      <Button disabled={user.uid !== data.data.uid}
                        onClick={() => goEditPost(data.data)} icon={<HighlightOutlined />}
                        type="primary" ghost>
                        修改
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Card> :
          <><Skeleton active /><Skeleton active /></>
      }
      <ReplyComp pid={id} />
      <ReplyList pid={id} />
    </div>
  )
}
