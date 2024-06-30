import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Post from '#models/post'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: number

  @column()
  declare userId: string

  @column()
  declare parentId: number

  @column()
  declare content: string

  @column({ serialize: Boolean })
  declare approved: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Comment, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Comment>

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
  })
  declare children: HasMany<typeof Comment>
  
}