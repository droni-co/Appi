import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Site from '#models/site'
import string from '@adonisjs/core/helpers/string'

export default class extends BaseSeeder {
  async run() {
    await Site.createMany([
      {
        id: '4ebaccf5-b863-4f12-aa49-9bbe0e1844e2',
        name: 'Droni.co',
        domain: 'droni.co',
        description: 'Desarrollo Inteligente',
        key: string.random(32)
      },
      {
        id: '047c9b0d-1999-4947-af89-41cc62642502',
        name: 'Kosante',
        domain: 'kosante.com',
        description: 'La más moderna plataforma especializada en nutrición para la salud.',
        key: string.random(32)
      }
    ])
  }
}