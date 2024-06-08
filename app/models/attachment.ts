import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

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

  @computed()
  get url() {
    return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_DOMAIN}/${this.path}`
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

}