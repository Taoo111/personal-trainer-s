import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'customerEmail',
    defaultColumns: ['customerEmail', 'status', 'total', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      // Admin widzi wszystkie zamówienia
      if (user.roles?.includes('admin')) return true
      // Użytkownik widzi tylko swoje zamówienia
      return {
        orderedBy: { equals: user.id },
      }
    },
    create: () => true, // Webhook Stripe tworzy zamówienia
    update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Oczekuje', value: 'pending' },
        { label: 'Opłacone', value: 'paid' },
        { label: 'Niepowodzenie', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      label: 'Suma (grosze)',
      admin: {
        description: 'Łączna kwota w groszach',
      },
    },
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Klient',
      admin: {
        description: 'Powiązany użytkownik (opcjonalne dla Guest Checkout)',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      label: 'Email klienta',
      admin: {
        description: 'Email do wysyłki plików i kontaktu',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Zamówione produkty',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Cena w momencie zakupu',
        },
      ],
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      label: 'Stripe Session ID',
      admin: {
        position: 'sidebar',
        description: 'ID sesji checkout w Stripe',
      },
    },
  ],
}
