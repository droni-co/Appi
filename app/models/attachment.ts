import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare siteId: string

  @column()
  declare userId: string

  @column()
  declare name: string

  @column()
  declare path: string

  @column()
  declare size: number

  @column()
  declare mime: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

}