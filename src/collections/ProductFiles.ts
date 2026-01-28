import type { CollectionConfig } from 'payload'

export const ProductFiles: CollectionConfig = {
  slug: 'product-files',
  admin: {
    description: 'Zabezpieczone pliki produktów (PDF, ZIP)',
  },
  access: {
    // Tylko admin - CMS niedostępny dla klientów
    read: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    create: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
  },
  upload: {
    mimeTypes: ['application/pdf', 'application/zip', 'application/x-zip-compressed'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nazwa pliku',
    },
  ],
}
