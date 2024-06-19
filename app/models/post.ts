import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Category from './category.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare siteId: string

  @column()
  declare userId: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare image: string | null

  @column()
  declare content: string | null

  @column()
  declare format: string

  @column({ serialize: Boolean })
  declare active: boolean

  @column()
  declare props: Record<string, any> | null | string

  @column()
  declare lang: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Category)
  declare categories: ManyToMany<typeof Category>

  @beforeSave()
  static async jsonProps(post: Post) {
    if (post.props) {
      post.props = JSON.stringify(post.props)
    }
  }
}