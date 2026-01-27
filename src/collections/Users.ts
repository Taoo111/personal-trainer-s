import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'createdAt'],
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => {
          return user?.roles?.includes('admin') ?? false
        },
      },
    },
    {
      name: 'purchases',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      admin: {
        description: 'Zamówienia tego użytkownika',
      },
    },
  ],
}
