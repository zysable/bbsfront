import {Card} from 'antd'
import ConverImage from '../../components/ToolsComps/ConverImage'

export default function Tools() {
  return (
    <div className="tools">
      <Card>
        <h1>这里会按需添加一些小工具，可以接一些后端服务接口进来，比如图片格式转换，图片压缩，发送email等。</h1>
        <p>下面是我自己的一个png/jpeg/gif转换成webp格式的服务，可以大幅度的降低图片文件大小，但不损失太多的图片质量。</p>
        <ConverImage />
      </Card>
    </div>
  )
}
