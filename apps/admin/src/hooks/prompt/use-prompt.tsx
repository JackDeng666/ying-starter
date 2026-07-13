import { App } from 'antd'
import { InfoCircleTwoTone } from '@ant-design/icons'
import { createRef } from 'react'
import { type PromptOptions, type PromptContentRef, PromptContent } from './prompt-content'

export function usePrompt() {
  const { modal } = App.useApp()
  return (options: PromptOptions) =>
    new Promise<string | null>(resolve => {
      const ref = createRef<PromptContentRef>()
      modal.confirm({
        title: options.title,
        icon: <InfoCircleTwoTone />,
        content: <PromptContent ref={ref} {...options} />,
        async onOk() {
          return ref.current!.validate().then(value => {
            resolve(value)
          })
        },
        onCancel() {
          resolve(null)
        }
      })
    })
}
