import React, {useCallback, useState} from 'react'
import {Layout, Input, Avatar, Pagination, Skeleton, Spin} from 'antd'
import {useSelector} from 'react-redux'
import {Link, useSearchParams} from 'react-router-dom'
import PostCards from '@/components/PostCards'
import {useGetPostsQuery} from '../../store/api/postApi'

const {Header, Content} = Layout
const {Search} = Input

export default function Home() {

  const [searchInput, setSearchInput] = useState('')
  const onSearch = useCallback((value) => {
    value = value.trim()
    setSearchInput(value)
  }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const {data: res, isSuccess, isLoading} = useGetPostsQuery({
    cp: searchParams.get('page') ?? 1,
    ps: searchParams.get('size') ?? 20,
    q: searchInput
  })
  const handlePageChange = (current, pageSize) => {
    setSearchParams({page: current, size: pageSize})
  }

  const user = useSelector(state => state.user)
  return (
    <Layout className="home-page">
      <Header>
        <Search
          placeholder="输入需要查询的文章关键字" allowClear loading={isLoading}
          onSearch={onSearch} size="large" style={{width: 280}}
        />
        <div className="user-wrapper">
          <span className="hidden-xs">你好，</span>
          <Link to="/edit-user" className="user-link">
            <span className="username hidden-xs">{user.username || '......'}</span>
            {user.avatar ?
              <Avatar src={require(`@/assets/images/${user.avatar}.webp`)} size="large" alt='' /> :
              <Spin />}
          </Link>
        </div>
      </Header>
      <Content>
        {
          (isSuccess && res.code === 200) ?
            <>
              <PostCards postList={res.data.postList} />
              <Pagination
                showSizeChanger
                onChange={handlePageChange}
                current={+(searchParams.get('page') ?? 1)}
                pageSize={+(searchParams.get('size') ?? 20)}
                total={res.data.total}
                pageSizeOptions={[20, 40, 80, 160]}
              />
            </> :
            <>
              {
                Array.from({length: 10}, (v, i) => (
                  <Skeleton active key={i} />
                ))
              }
            </>
        }
      </Content>
    </Layout>
  )
}
