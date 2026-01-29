import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { ProductFiles } from './collections/ProductFiles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'sklep@example.com'
const fromName = process.env.EMAIL_FROM_NAME || 'Trainer Pro'

const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: fromAddress,
      defaultFromName: fromName,
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
      },
    })
  : nodemailerAdapter({
      defaultFromAddress: fromAddress,
      defaultFromName: fromName,
    })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Orders, ProductFiles],
  editor: lexicalEditor(),
  email: emailAdapter,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
