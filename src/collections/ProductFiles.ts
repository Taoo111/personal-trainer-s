import type { CollectionConfig } from 'payload'

export const ProductFiles: CollectionConfig = {
  slug: 'product-files',
  admin: {
    description: 'Zabezpieczone pliki produktów (PDF, ZIP)',
  },
  access: {
    // Pliki dostępne tylko dla admina i kupujących
    read: async ({ req }) => {
      const { user } = req

      // Admin ma dostęp
      if (user?.roles?.includes('admin')) return true

      // Zalogowany użytkownik - sprawdź czy kupił produkt
      if (user) {
        return {
          'product.orders.orderedBy': { equals: user.id },
        }
      }

      return false
    },
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
