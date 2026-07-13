import { useEffect } from 'react'
import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

// import { ClientToServerEvents, ServerToClientEvents } from '@ying/shared'

import { useAuthTokens } from './userStore'

type SocketStore = {
  socket?: Socket
  connected: boolean
}

export const useSocketStore = create<SocketStore>(() => ({
  connected: false
}))

export const useSocketIo = () => {
  const { accessToken } = useAuthTokens()

  useEffect(() => {
    if (!accessToken) return

    const socket = io({
      auth: {
        token: accessToken
      },
      transports: ['websocket']
    })

    socket.on('connect', () => {
      useSocketStore.setState({ connected: true })
    })
    socket.on('disconnect', () => {
      useSocketStore.setState({ connected: false })
    })

    socket.on('authFail', () => {
      console.error('ws 授权失败.')
    })

    useSocketStore.setState({ socket })

    return () => {
      socket.disconnect()
    }
  }, [accessToken])
}
