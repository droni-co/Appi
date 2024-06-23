import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .uuid('site_id')
        .notNullable()
        .references('id')
        .inTable('sites')
        .onDelete('CASCADE')
      table.integer('parent_id').unsigned().defaultTo(0).notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.unique(['site_id', 'slug'])
      table.text('description').nullable()
      table.string('image').nullable()
      table.string('lang').defaultTo('es')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}