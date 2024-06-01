import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique()
      table.string('name').nullable()
      table.string('username', 80).notNullable().unique()
      table.string('avatar').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('lang').defaultTo('es')
      table.string('provider').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}