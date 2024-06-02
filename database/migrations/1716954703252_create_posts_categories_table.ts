import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigInteger('post_id').unsigned().notNullable()
      table.bigInteger('category_id').unsigned().notNullable()
      table.unique(['post_id', 'category_id']).primary(['post_id', 'category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}