import styled from 'styled-components'

export const StyledUpload = styled.div<{ $thumbnail?: boolean }>`
  .ant-upload {
    border: none !important;
  }
  .ant-upload-list {
    display: ${props => (props.$thumbnail ? 'flex' : 'block')};
    flex-wrap: wrap;
  }
`
