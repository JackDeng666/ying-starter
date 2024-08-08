interface NotificationOptions {
  image?: string
  actions?: NotificationAction[]
}

interface NotificationAction {
  action: string
  title: string
  icon?: string
}
