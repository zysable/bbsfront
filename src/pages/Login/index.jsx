import React, {useCallback, useEffect, useRef} from 'react'
import {Card, Button, Checkbox, Form, Input, message} from 'antd'
import {UserOutlined, LockOutlined} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {useLoginMutation} from '@/store/api/userApi'
import {login} from '@/store/reducers/userSlice'
import Logo from '@/assets/images/logo.webp'

export default function Login() {

  const formRef = useRef()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  const [loginFn] = useLoginMutation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (user.isLogged) navigate('/', {replace: true})
  }, [navigate, user.isLogged])

  const onFinish = values => {
    loginFn({username: values.username, password: values.password})
      .then(({data: res}) => {
        if (res.code === 200) {
          dispatch(login({
            token: res.data.token,
            remember: values.remember
          }))
          message.success(res.msg)
          formRef.current?.resetFields()
          navigate('/', {replace: true})
        } else {
          if (res.code === 401) message.error(res.msg)
          else console.error(res.msg)
        }
      }).catch(console.error)
  }
  const onFinishFailed = useCallback(errorInfo => {
    console.log('Failed:', errorInfo)
  }, [])

  const onReset = useCallback(() => {
    formRef.current?.resetFields()
  }, [])

  return (
    <div className="login">
      <Card style={{width: 600}} className="login-card">
        <img src={Logo} alt="" />
        <h2 className="title">欢迎来到新乡没事喷喷BBS</h2>
        <h2 className="desc">畅所欲言，无所不能</h2>
        <Form ref={formRef}
          name="basic"
          initialValues={{remember: true}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{required: true, message: '用户名必须输入！'}]}
          >
            <Input size="large" placeholder="请输入你的用户名" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{required: true, message: '密码必须输入！'}]}
          >
            <Input.Password size="large" placeholder="请输入你的密码" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>7天内不需要登录</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              登录
            </Button>
            <Button htmlType="button" size="large" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
