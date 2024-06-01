import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import * as crypto from 'crypto'

export default class Site extends BaseModel {
  @column({ isPrimary: true })
  declare id: crypto.UUID

  @column()
  declare name: string

  @column()
  declare domain: string

  @column()
  declare description: string | null

  @column()
  declare logo: string | null

  @column()
  declare props: Record<string, any> | null

  @column()
  declare key: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}