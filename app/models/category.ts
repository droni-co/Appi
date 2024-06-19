import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'


export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare siteId: string

  @column()
  declare parentId: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare image: string

  @column()
  declare lang: string

  @belongsTo(() => Category, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Category>

  @hasMany(() => Category, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Category>
}