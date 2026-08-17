import { Typography, Upload as AntdUpload } from 'antd'
import type { ItemRender } from 'antd/es/upload/interface'

import { StyledUpload } from './styles'
import UploadIllustration from './upload-illustration'
import UploadListItem from './upload-list-item'

import type { UploadProps } from 'antd'

const { Dragger } = AntdUpload
const { Text, Title } = Typography

interface Props extends UploadProps {
  thumbnail?: boolean
}

const itemRender: (thumbnail: boolean) => ItemRender = thumbnail => {
  return function temp(_, file, __, actions) {
    return <UploadListItem file={file} actions={actions} thumbnail={thumbnail} />
  }
}
export function Upload({ thumbnail = false, ...other }: Props) {
  return (
    <StyledUpload $thumbnail={thumbnail}>
      <Dragger {...other} itemRender={itemRender(thumbnail)}>
        <div className="opacity-100 hover:opacity-80">
          <div className="m-auto max-w-50">
            <UploadIllustration />
          </div>
          <Typography>
            <Title level={5} className="mt-4">
              拖放或选择文件
            </Title>
            <Text type="secondary">将文件拖放到此处或单击浏览文件</Text>
          </Typography>
        </div>
      </Dragger>
    </StyledUpload>
  )
}
