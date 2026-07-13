import { In } from 'typeorm'
import { getPermissionTree } from '@ying/permission'
import { SysPermissionEntity } from '@ying/entity'
import dataSource from '../typeorm.config'
;(async function () {
  await dataSource.initialize()
  const sysPermissionRepository = dataSource.getRepository(SysPermissionEntity)

  const permissionTree = getPermissionTree()

  const existPermissions = await sysPermissionRepository.find()
  const codes = existPermissions.map(el => el.code)

  const newCodes: string[] = []

  const permissionTreeIntoDb = async (arr: SysPermissionEntity[]) => {
    newCodes.push(...arr.map(permission => permission.code))

    await Promise.all(
      arr.map(async permission => {
        if (codes.includes(permission.code)) {
          await sysPermissionRepository.update(
            { code: permission.code },
            sysPermissionRepository.create({
              ...permission,
              children: undefined
            })
          )
        } else {
          await sysPermissionRepository.save(sysPermissionRepository.create(permission))
        }
        if (permission.children?.length) {
          await permissionTreeIntoDb(permission.children)
        }
      })
    )
  }

  await permissionTreeIntoDb(permissionTree)

  const waitDeleteCodes = codes.filter(code => !newCodes.includes(code))
  await sysPermissionRepository.delete({ code: In(waitDeleteCodes) })
})().finally(() => {
  process.exit(1)
})
