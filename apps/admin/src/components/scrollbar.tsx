import SimpleBar, { type Props } from 'simplebar-react'
/**
 * https://www.npmjs.com/package/simplebar-react?activeTab=readme
 */
export const Scrollbar = ({
  ref,
  children,
  ...other
}: Props & {
  ref?: HTMLElement
}) => {
  return (
    <SimpleBar className="h-full" scrollableNodeProps={{ ref }} clickOnTrack={false} {...other}>
      {children}
    </SimpleBar>
  )
}
