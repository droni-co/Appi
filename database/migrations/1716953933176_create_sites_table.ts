import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().unique()
      table.string('name').notNullable()
      table.string('domain').notNullable()
      table.string('description').nullable()
      table.string('logo').nullable()
      table.json('props').nullable()
      table.string('key').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}