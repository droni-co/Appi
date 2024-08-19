import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .uuid('site_id')
        .notNullable()
        .references('id')
        .inTable('sites')
        .onDelete('CASCADE')
      table.uuid('user_id').nullable()
      table.string('service').nullable()
      table.string('name').nullable()
      table.string('email').nullable()
      table.string('phone').nullable()
      table.string('message').nullable()
      table.string('source').nullable()
      table.string('status').defaultTo('new')
      table.json('comments').defaultTo([])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}