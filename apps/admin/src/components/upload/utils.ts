import { RcFile } from 'antd/es/upload'

const FORMAT_PDF = ['pdf']
const FORMAT_TEXT = ['txt']
const FORMAT_PHOTOSHOP = ['psd']
const FORMAT_WORD = ['doc', 'docx']
const FORMAT_EXCEL = ['xls', 'xlsx']
const FORMAT_ZIP = ['zip', 'rar', 'iso']
const FORMAT_ILLUSTRATOR = ['ai', 'esp']
const FORMAT_POWERPOINT = ['ppt', 'pptx']
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac']
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg']
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm']

/**
 * 获取文件格式
 * @param fileName
 */
export function getFileFormat(fileName: string | undefined) {
  let format: string
  switch (true) {
    case FORMAT_PDF.includes(fileTypeByName(fileName)):
      format = 'pdf'
      break
    case FORMAT_TEXT.includes(fileTypeByName(fileName)):
      format = 'txt'
      break
    case FORMAT_PHOTOSHOP.includes(fileTypeByName(fileName)):
      format = 'psd'
      break
    case FORMAT_WORD.includes(fileTypeByName(fileName)):
      format = 'word'
      break
    case FORMAT_EXCEL.includes(fileTypeByName(fileName)):
      format = 'excel'
      break
    case FORMAT_ZIP.includes(fileTypeByName(fileName)):
      format = 'zip'
      break
    case FORMAT_ILLUSTRATOR.includes(fileTypeByName(fileName)):
      format = 'ai'
      break
    case FORMAT_POWERPOINT.includes(fileTypeByName(fileName)):
      format = 'ppt'
      break
    case FORMAT_AUDIO.includes(fileTypeByName(fileName)):
      format = 'audio'
      break
    case FORMAT_IMG.includes(fileTypeByName(fileName)):
      format = 'img'
      break
    case FORMAT_VIDEO.includes(fileTypeByName(fileName)):
      format = 'video'
      break
    default:
      format = fileTypeByName(fileName)
  }
  return format
}

/**
 * 获取文件图标
 * @param fileName
 */
export function getFileIcon(fileName: string | undefined) {
  let thumb: string
  const format = getFileFormat(fileName)
  switch (format) {
    case 'txt':
      thumb = 'file-txt'
      break
    case 'zip':
      thumb = 'file-zip'
      break
    case 'audio':
      thumb = 'file-audio'
      break
    case 'video':
      thumb = 'file-video'
      break
    case 'word':
      thumb = 'file-word'
      break
    case 'excel':
      thumb = 'file-excel'
      break
    case 'ppt':
      thumb = 'file-ppt'
      break
    case 'pdf':
      thumb = 'file-pdf'
      break
    case 'psd':
      thumb = 'file-psd'
      break
    case 'ai':
      thumb = 'file-ai'
      break
    case 'img':
      thumb = 'file-img'
      break
    case 'folder':
      thumb = 'file-folder'
      break
    default:
      thumb = 'file-default'
  }
  return thumb
}

export function fileTypeByName(fileName = '') {
  return (fileName && fileName.split('.').pop()) || 'folder'
}

export function getBase64(file: RcFile, callback: (url: string) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(file)
}

export function getBlobUrl(file: RcFile) {
  const fileBlob = new Blob([file])
  return URL.createObjectURL(fileBlob)
}
