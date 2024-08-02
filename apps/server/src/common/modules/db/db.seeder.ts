import { Inject, Injectable } from '@nestjs/common'
import { In, Repository, TreeRepository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigType } from '@nestjs/config'
import { faker } from '@faker-js/faker'
import { authConfig } from '@/server/config'
import { FileSourceType, FileType } from '@ying/shared'
import { SysPermissionEntity, SysRoleEntity, SysUserEntity } from '@ying/shared/entities'
import { getPermissionTree } from '@ying/shared/permission'
import { FileService } from '@/server/common/modules/storage/file.service'
import { generatePass } from '@/server/common/utils'

@Injectable()
export class DbSeeder {
  constructor(
    @InjectRepository(SysPermissionEntity)
    private readonly sysPermissionRepository: TreeRepository<SysPermissionEntity>,
    @InjectRepository(SysUserEntity)
    private readonly sysUserRepository: Repository<SysUserEntity>,
    @InjectRepository(SysRoleEntity)
    private readonly sysRoleRepository: Repository<SysRoleEntity>,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>,
    private readonly fileService: FileService
  ) {
    this.initPermission()
    this.initRoleAndUser()
  }

  async initPermission() {
    const permissionTree = getPermissionTree()

    const existPermissions = await this.sysPermissionRepository.find()
    const codes = existPermissions.map(el => el.code)

    const newCodes = []

    const permissionTreeIntoDb = async (arr: SysPermissionEntity[]) => {
      newCodes.push(...arr.map(permission => permission.code))

      await Promise.all(
        arr.map(async permission => {
          if (codes.includes(permission.code)) {
            await this.sysPermissionRepository.update(
              { code: permission.code },
              this.sysPermissionRepository.create({
                ...permission,
                children: undefined
              })
            )
          } else {
            await this.sysPermissionRepository.save(this.sysPermissionRepository.create(permission))
          }
          if (permission.children?.length) {
            await permissionTreeIntoDb(permission.children)
          }
        })
      )
    }

    await permissionTreeIntoDb(permissionTree)

    const waitDeleteCodes = codes.filter(code => !newCodes.includes(code))
    await this.sysPermissionRepository.delete({ code: In(waitDeleteCodes) })
  }

  async initRoleAndUser() {
    const sysUser = await this.sysUserRepository.findOne({
      where: {
        account: this.authConf.adminName
      }
    })
    if (!sysUser) {
      let sysRole = await this.sysRoleRepository.findOne({
        where: {
          name: 'Super Admin'
        }
      })
      if (!sysRole) {
        sysRole = this.sysRoleRepository.create({
          name: 'Super Admin',
          systemic: true,
          remark: 'super admin role'
        })
      }

      const sysUser = this.sysUserRepository.create({
        name: this.authConf.adminName,
        account: this.authConf.adminName,
        password: generatePass(this.authConf.adminPass),
        remark: 'super admin account',
        roles: [sysRole]
      })

      await this.sysUserRepository.save(sysUser)

      const newFile = await this.fileService.addFile({
        url: faker.image.avatarLegacy(),
        fileType: FileType.Url,
        from: FileSourceType.Admin,
        userId: sysUser.id
      })

      this.sysUserRepository.update(
        {
          id: sysUser.id
        },
        {
          avatar: newFile
        }
      )
    }
  }
}
