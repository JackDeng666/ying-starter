class IndexedDbOperation {
  _objectStore
  constructor(objectStore) {
    this._objectStore = objectStore
  }

  _promiseWrap(request) {
    return new Promise((resovle, reject) => {
      request.onsuccess = function () {
        resovle(request?.result)
      }
      request.onerror = function () {
        reject(request.error)
      }
    })
  }

  add(data) {
    return this._promiseWrap(this._objectStore.add(data))
  }

  delete(query) {
    return this._promiseWrap(this._objectStore.delete(query))
  }

  put(data) {
    return this._promiseWrap(this._objectStore.put(data))
  }

  get(data) {
    return this._promiseWrap(this._objectStore.get(data))
  }

  static openDbStore(dbTableInfo) {
    const { dbName, storeName, keyPath, version } = dbTableInfo

    return new Promise((resovle, reject) => {
      const request = indexedDB.open(dbName, version)
      request.onsuccess = function () {
        const db = request.result
        const transaction = db.transaction(storeName, 'readwrite')
        const objectStore = transaction.objectStore(storeName)
        resovle(new IndexedDbOperation(objectStore))
      }
      request.onerror = function () {
        reject(request.error)
      }
      request.onupgradeneeded = function () {
        const db = request.result
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath })
        }
      }
    })
  }
}

async function fetchData(url, method, body) {
  const appInfoStore = await IndexedDbOperation.openDbStore({
    dbName,
    storeName,
    keyPath
  })

  const data = await appInfoStore.get('apiUrl')

  return fetch(`${data?.data}${url}`, {
    method,
    body,
    headers: {
      pragma: 'no-cache',
      'cache-control': 'no-cache'
    }
  })
}

const dbName = 'ying'
const storeName = 'appInfo'
const keyPath = 'key'

addEventListener('install', () => {
  console.log('bg install')
})

addEventListener('activate', () => {
  console.log('bg activate')
})

addEventListener('push', event => {
  console.log('push event:', event)
  const data = event.data.json()
  console.log('data:', data)

  self.registration.showNotification(data.title, {
    body: data.body || '',
    image: data.image?.url,
    actions: data.actions ? data.actions.map(el => ({ action: el.title, title: el.title })) : [],
    data
  })
})

addEventListener('notificationclick', async event => {
  console.log('notificationclick event:', event)
  event.notification.close()
  const data = event.notification.data

  if (data.pushRecordId) {
    fetchData(`/notice/${data.pushRecordId}/click`, 'get')
  }

  if (event.action) {
    const findAction = data.actions?.find(el => el.title == event.action)
    if (findAction?.link) {
      self.clients.openWindow(findAction.link)
    }
  } else {
    if (data.link) {
      self.clients.openWindow(data.link)
    }
  }
})

addEventListener('message', async event => {
  console.log(event, 'message event')

  const { type, data } = event.data
  if (type == 'SET_APP_API_URL') {
    const appInfoStore = await IndexedDbOperation.openDbStore({
      dbName,
      storeName,
      keyPath
    })
    appInfoStore.put(data)
  }
})
