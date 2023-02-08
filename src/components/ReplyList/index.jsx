import React from 'react'
import {Pagination, Skeleton, Divider, message, Avatar, List, Button, Popconfirm} from 'antd'
import {useSearchParams} from 'react-router-dom'
import {useDeleteReplyMutation, useGetRepliesQuery} from '../../store/api/replyApi'
import {elapsedTime} from '@/utils'
import './reply-list.scss'
import {useSelector, useDispatch} from 'react-redux'
import postApi from '../../store/api/postApi'
import {logout} from '@/store/reducers/userSlice'

export default function ReplyList(props) {

  const user = useSelector(state => state.user)
  const [deleteReplyFn] = useDeleteReplyMutation()

  const [searchParams, setSearchParams] = useSearchParams()
  const {data: res, isSuccess} = useGetRepliesQuery({
    cp: searchParams.get('page') ?? 1,
    ps: searchParams.get('size') ?? 20,
    pid: props.pid
  })
  const handlePageChange = (current, pageSize) => {
    setSearchParams({page: current, size: pageSize})
  }

  const dispatch = useDispatch()
  const deleteReply = async cid => {
    try {
      const {data} = await deleteReplyFn(cid)
      if (data.code === 401) {
        message.error(data.msg)
        return dispatch(logout())
      }
      if (data.code !== 200) throw new Error(data.msg)
      dispatch(postApi.util.invalidateTags(['Posts']))
    } catch (e) {
      console.error(e)
    }
  }

  const confirm = cid => {
    deleteReply(cid)
  }
  const cancel = () => {
  }

  return (
    <div className="reply-list">
      <Divider plain>所有回复</Divider>
      {
        isSuccess && res.code === 200 ?
          <>
            <List
              itemLayout="horizontal"
              dataSource={res.data.replyList}
              renderItem={(item, index) => (
                <List.Item actions={[
                  <Popconfirm
                    title="删除回复"
                    description="确认删除此条回复？"
                    onConfirm={() => confirm(item.cid)}
                    onCancel={cancel}
                    okText="是"
                    cancelText="否"
                  >
                    <Button type="text" danger
                      disabled={item.uid !== user.uid}>
                      删除
                    </Button>
                  </Popconfirm>

                ]}>
                  <List.Item.Meta
                    avatar={<Avatar src={require(`@/assets/images/${item.avatar}.webp`)} size={50} />}
                    title={`${item.username} - 发布于${elapsedTime(item.createdAt)}前`}
                    description={item.comment}
                  />
                  <div className="floor">{((searchParams.get('page') ?? 1) - 1) * (searchParams.get('size') ?? 20) + index + 1}楼</div>
                </List.Item>
              )}
            />
            <div className="pagi-wrapper">
              <Pagination
                showSizeChanger
                onChange={handlePageChange}
                current={+(searchParams.get('page') ?? 1)}
                pageSize={+(searchParams.get('size') ?? 20)}
                total={res.data.total}
                pageSizeOptions={[20, 40, 80]}
              />
            </div>

          </> :
          <>
            {
              Array.from({length: 3}, (_, i) => (
                <Skeleton active key={i} />
              ))
            }
          </>
      }

    </div>
  )
}
