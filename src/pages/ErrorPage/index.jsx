import React from 'react'
import {Card} from 'antd'
import ErrorLogo from '@/assets/images/404.webp'

export default function ErrorPage() {
  return (
    <div className="error-wrapper">
      <Card style={{width: 600}}>
        <img src={ErrorLogo} alt="" />
        <h1>404 没有找到页面</h1>
        <h2>你走错地方了</h2>
        <h2>其实这里什么都没有</h2>
      </Card>
    </div>
  )
}
