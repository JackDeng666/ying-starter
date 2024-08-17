import { App, Button, Modal, QRCode } from 'antd'

import { useDialogOpen } from '@ying/fontend-shared/hooks'
import { ArticleEntity } from '@ying/shared/entities'
import { copyText, doDownload } from '@ying/fontend-shared/utils'

export type ArticlePromotionModalProps = ReturnType<typeof useDialogOpen<ArticleEntity>>

export const ArticlePromotionModal = ({ formValue, open, onClose }: ArticlePromotionModalProps) => {
  const { message } = App.useApp()

  const title = `推广-${formValue?.name}`
  const link = `${import.meta.env.VITE_APP_CLIENT_URL}/article/${formValue?.id}`

  return (
    <Modal title={title} open={open} footer={null} onCancel={onClose}>
      <div className="flex items-center justify-center gap-4 py-4">
        <QRCode id="QRCode" value={link} size={200} />
        <div className="flex flex-col gap-4">
          <Button
            type="dashed"
            onClick={() => {
              const canvas = document.getElementById('QRCode')?.querySelector<HTMLCanvasElement>('canvas')
              if (canvas) {
                const url = canvas.toDataURL()
                doDownload(url, 'QRCode.png')
              }
            }}
          >
            下载二维码
          </Button>
          <Button
            type="default"
            onClick={async () => {
              await copyText(link)
              message.success('复制成功')
            }}
          >
            复制链接
          </Button>
          <Button type="primary" onClick={() => window.open(link)}>
            预览链接
          </Button>
        </div>
      </div>
    </Modal>
  )
}
