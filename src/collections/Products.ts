import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'createdAt'],
  },
  access: {
    read: () => true, // Produkty są publiczne
    create: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nazwa produktu',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly nazwa (np. "plan-treningowy-30-dni")',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Cena (PLN)',
      admin: {
        description: 'Cena w groszach (np. 9900 = 99 PLN)',
      },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      label: 'Stripe Product ID',
      admin: {
        position: 'sidebar',
        description: 'ID produktu w Stripe',
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      label: 'Stripe Price ID',
      admin: {
        position: 'sidebar',
        description: 'ID ceny w Stripe',
      },
    },
    {
      name: 'productFile',
      type: 'upload',
      relationTo: 'product-files',
      required: true,
      label: 'Plik produktu (PDF/ZIP)',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Okładka',
    },
  ],
}
