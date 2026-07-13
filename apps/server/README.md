## service worker 消息推送设置

```bash
pnpm webpush:generate
```

## 数据库同步

### 1. 配置数据源

`typeorm.config.ts` 下配置了要同步的数据库连接信息

```ts
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'ying123456',
  database: 'ying',
  entities: [],
  migrations: ['migrations/*.ts']
})
```

### 2. 生成 Migration 文件

自动生成（generate）

当修改了实体类后，可以使用自动生成命令来比较当前实体与数据库实际结构的差异，然后生成相应的迁移文件：

```bash
pnpm typeorm-ts-node-commonjs migration:generate ./migrations/[迁移名称] -d ./typeorm.config.ts
```

手动创建（create）

如果需要手动编写 SQL 或逻辑，可以先创建一个空的迁移模板：

```bash
pnpm typeorm-ts-node-commonjs migration:create ./migrations/[迁移名称]
```

### 3. 执行 Migration

生成好迁移文件后，就可以把这些变更应用到数据库中。使用以下命令来运行所有尚未执行的迁移：

```bash
pnpm typeorm-ts-node-commonjs migration:run -d ./typeorm.config.ts
```

### 4. 回退 Migration

如果需要回滚最近一次的迁移操作，可以使用：

```bash
pnpm typeorm-ts-node-commonjs migration:revert -d ./typeorm.config.ts
```
