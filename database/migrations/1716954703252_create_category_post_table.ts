import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'category_post'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('post_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('posts')
        .onDelete('CASCADE')

      table.integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
        
      table.unique(['post_id', 'category_id']).primary(['post_id', 'category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}