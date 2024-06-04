import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as crypto from 'crypto'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Site from '#models/site'
import User from '#models/user'

export default class Enrollment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare siteId: crypto.UUID

  @column()
  declare userId: crypto.UUID

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Site)
  declare site: BelongsTo<typeof Site>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}