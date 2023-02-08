import React from 'react'
import {EyeOutlined, MessageOutlined} from '@ant-design/icons'
import {Card, Space, Avatar} from 'antd'
import {Link} from 'react-router-dom'
import './post-cards.scss'
import {elapsedTime} from '@/utils'

export default function PostCards({postList}) {
  return (
    <Space direction="vertical" style={{display: 'flex'}} className="post-cards">
      {
        postList.map((p) =>
          <Card key={p.pid}>
            <div className="wrapper">
              <div className="left">
                <div className="avatar-wrapper">
                  <Avatar src={p.user_avatar ? require(`@/assets/images/${p.user_avatar}.webp`) : ''} size="large" alt='' />
                  <div className="author-name">{p.username}</div>
                </div>
                <div className="text-wrapper">
                  <p className="title">
                    <Link to={`/post/${p.pid}`}>{p.title}</Link>
                    {
                      p.lastModified ?
                        <span><i>-</i>更新于 {new Date(p.lastModified).toLocaleString('zh-CN')}</span> :
                        <span><i>-</i>发布于 {new Date(p.createdAt).toLocaleString('zh-CN')}</span>
                    }
                  </p>
                  <p className="desc">{p.desc}</p>
                  {
                    p.last_cid ?
                      <p className="pub-info"><b>{p.last_reply_user}</b> 在{elapsedTime(p.last_reply_time)}前 <i>回复了最后一条</i></p> :
                      <p className="pub-info">目前没有回复</p>
                  }

                </div>
              </div>
              <div className="right">
                <div className="view"><EyeOutlined /><span>{p.v_count}</span></div>
                <div className="reply"><MessageOutlined /><span>{p.r_count}</span></div>
              </div>
            </div>
          </Card>
        )
      }
    </Space>
  )
}
