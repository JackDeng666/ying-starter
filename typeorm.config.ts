import { DataSource } from 'typeorm'

export default new DataSource({
  charset: 'utf8mb4',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'ying123456',
  database: 'ying_starter',
  entities: ['libs/shared/src/entities/*.entity.ts'],
  migrations: ['migrations/*.ts']
})
