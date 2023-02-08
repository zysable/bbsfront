import React, {useCallback, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import AuthComponent from '@/components/AuthComponent'
import {ReadOutlined, EditOutlined, PlusOutlined, LogoutOutlined, ToolOutlined} from '@ant-design/icons'
import {Button, Layout, Menu, message, Popconfirm} from 'antd'
import {useDispatch} from 'react-redux'
import {logout} from '@/store/reducers/userSlice'
import HomeLogo from '@/assets/images/home-logo.webp'

const {Sider} = Layout

function getItem(label, key, icon, title) {
  return {
    key,
    icon,
    label,
    title
  }
}
const items = [
  getItem('所有文章', '/', <ReadOutlined />, ''),
  getItem('发布新文章', '/create-post', <PlusOutlined />, ''),
  getItem('修改个人信息', '/edit-user', <EditOutlined />, ''),
  getItem('实用工具集', '/tools', <ToolOutlined />, '')
]

export default function MyLayout() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleMenuClick = ({key}) => {
    if (window.innerWidth < 992) setCollapsed(true)
    navigate(key)
  }

  const [open, setOpen] = useState(false)
  const confirm = () => {
    setOpen(false)
    dispatch(logout())
    message.success('您已安全退出！')
  }
  const cancel = useCallback(() => {
    setOpen(false)
    if (window.innerWidth < 992) setCollapsed(true)
  }, [])
  const showPopconfirm = useCallback(() => {
    setOpen(true)
  }, [])

  return (
    <AuthComponent>
      <Layout className="home-layout">
        <Sider className="home-sider"
          breakpoint="lg" collapsedWidth="0" width={234}
          collapsed={collapsed}
          onCollapse={(collapsed) => {
            setCollapsed(collapsed)
          }}
        >
          <div className="top">
            <img src={HomeLogo} alt="" />
            <p>新乡没事喷喷BBS</p>
          </div>
          <div className="bottom">
            <Menu style={{width: 233}}
              selectedKeys={[location.pathname]}
              items={items} onSelect={handleMenuClick}
            />
            <div className="logout">
              <Popconfirm
                title="退出登录"
                description="是否确定登出BBS？"
                open={open}
                onConfirm={confirm}
                onCancel={cancel}
                okText="是"
                cancelText="否"
              >
                <Button type="primary" onClick={showPopconfirm} size="large"
                  icon={<LogoutOutlined />}
                >
                  退出登录
                </Button>
              </Popconfirm>
            </div>
          </div>
        </Sider>
        <Outlet />
      </Layout>
    </AuthComponent >
  )
}
