type IframeProps = {
  src: string
}

export default function Iframe({ src }: IframeProps) {
  return (
    <div className="h-full w-full">
      <iframe src={src} title="iframe-page" className="h-full w-full" />
    </div>
  )
}
