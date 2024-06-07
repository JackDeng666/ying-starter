import styled from 'styled-components'
import { GlobalToken } from 'antd'

export const StyledRnd = styled.div<{ $token: GlobalToken }>`
  border-color: ${props => props.$token.colorPrimary};
  border-width: 2px;
  width: 100%;
  height: 100%;
`

export const StyledHandleCom = styled.div<{ $token: GlobalToken }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ffffff;
  transition: all;
  &:hover {
    background-color: ${props => props.$token.colorPrimary};
  }
`
