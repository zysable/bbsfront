import {Avatar, Card, Row, Col, Form, Input, Button, message, Spin, Popconfirm} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useUpdateUserMutation} from '../../store/api/userApi'
import postApi from '../../store/api/postApi'
import {logout, saveUser} from '@/store/reducers/userSlice'
import {useNavigate} from 'react-router-dom'

export default function EditUserInfo() {
  const user = useSelector(state => state.user)
  const {avatarList} = useSelector(state => state.avatar)
  const userAvatar = avatarList.find(a => a.avatarName === user.avatar)

  const [form] = Form.useForm()

  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    setAvatar(userAvatar)
    form.setFieldValue('username', user.username)
  }, [userAvatar, user.username, form])

  const handlerChangeAvatar = useCallback(choosedAvatar => {
    setAvatar(choosedAvatar)
  }, [])


  const [updateUserFn] = useUpdateUserMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onFinish = (values) => {
    if (!values.username.trim()) return message.error('用户名不能为空！')
    const formData = {
      username: values.username,
      password: values.password,
      avatar: avatar.avatarName
    }
    updateUserFn(formData)
      .then(({data: res}) => {
        if (res.code === 401) {
          if (localStorage.getItem('token') || sessionStorage.getItem('token')) message.error(res.msg)
          dispatch(logout())
        } else {
          if (res.code !== 200) throw new Error(res.msg)
          if (formData.password || formData.username !== user.username) {
            dispatch(saveUser(res.data))
            message.success('用户名或密码修改，需要重新登录！')
            dispatch(logout())
          } else {
            dispatch(saveUser(res.data))
            dispatch(postApi.util.invalidateTags(['Posts', 'Post']))
            message.success(res.msg)
            navigate('/', {replace: true})
          }
        }
      }).catch(e => {
        if (e.message === '用户名已被注册！') message.error('用户名已被注册！')
        else console.error(e)
      })
  }
  const onFinishFailed = useCallback((errorInfo) => {
    console.log('Failed:', errorInfo)
  }, [])


  const confirm = () => {
    form.submit()
  }
  const cancel = () => {
    return
  }

  return (
    <div className="edit-user">
      <Card>

        {
          avatar ? <Avatar size={64} src={avatar.avatarUrl} /> : <Spin />
        }
        <p>选择头像</p>
        <div className="avatar-wrapper">
          {
            avatarList ?
              <Row gutter={[8, 8]}>
                {
                  avatarList.map(item => (
                    <Col className="gutter-row" xs={6} md={4} xl={3} key={item.avatarName} >
                      <Avatar size={48} src={item.avatarUrl} onClick={() => handlerChangeAvatar(item)} />
                    </Col>
                  ))
                }
              </Row> :
              <Spin size="large">
                <div className="loading-content" />
              </Spin>
          }
        </div>
        <Form size="large" name="basic" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item label="用户名" name="username"
                rules={[
                  {
                    required: true,
                    message: '提交时用户名不能为空！',
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="密码" name="password">
                <Input.Password placeholder="密码不修改就不用填" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Popconfirm
              placement="bottom"
              title="修改信息"
              description="确定修改个人信息？"
              onConfirm={confirm}
              onCancel={cancel}
              okText="是"
              cancelText="否"
            >
              <Button type="primary" htmlType="submit">
                提交修改
              </Button>
            </Popconfirm>

          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
