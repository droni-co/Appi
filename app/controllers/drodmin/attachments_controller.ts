import type { HttpContext } from '@adonisjs/core/http'
import Attachment from '#models/attachment'
import { adminAttachmentValidator } from '#validators/admin/attachments'
import aws from 'aws-sdk'
import fs from 'node:fs'
import string from '@adonisjs/core/helpers/string'


export default class AttachmentsController {
  /**
   * Display a list of resource
   */
  async index({ request, params }: HttpContext) {
    const siteId = params.siteId
    const { page=1, limit=20, orderBy='created_at', sort='desc' } = request.qs()
    const attachments = await Attachment.query()
      .where('site_id', siteId)
      .orderBy(orderBy, sort)
      .paginate(page, limit)

    return attachments
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, params  }: HttpContext) {
    const siteId = params.siteId
    const user = await auth.authenticate()
    const payload = await adminAttachmentValidator.validate({...request.all(), file: request.file('file')})
    const path = `${siteId}/${user.id}/${payload.file.size}-${string.slug(payload.file.clientName)}.${payload.file.extname}`

    /* file upload */
    aws.config.update({
      region: 'nyc3',
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET
    });
    const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
    const s3 = new aws.S3({
      endpoint: spacesEndpoint
    });
    s3.upload({
      Bucket: 'dronico',
      Key: path,
      Body: payload.file.tmpPath ? fs.readFileSync(payload.file.tmpPath) : undefined,
      ContentType: payload.file.type,
      ACL: 'public-read'
    }, (err, data) => {
      console.log(err, data);
    });
    const attachment = await Attachment.create({
      siteId,
      userId: user.id,
      name: payload.name,
      path: path,
      size: payload.file.size,
      mime: payload.file.type,
    })
    return attachment
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const siteId = params.siteId
    const attachment = await Attachment.query()
    .where('site_id', siteId)
    .andWhere('id', params.id)
    .firstOrFail()

    /* file delete */
    aws.config.update({
      region: 'nyc3',
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET
    });
    const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
    const s3 = new aws.S3({
      endpoint: spacesEndpoint
    });
    s3.deleteObject({
      Bucket: 'dronico',
      Key: attachment.path
    }, (err, data) => {
      console.log(err, data);
    });
   
    await attachment.delete()
    return attachment
  }
}