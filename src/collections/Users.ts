import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'createdAt'],
  },
  auth: true,
  access: {
    // Pozwól na publiczną rejestrację
    create: () => true,
    // Tylko zalogowani użytkownicy mogą czytać (admin widzi wszystkich, user tylko siebie)
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { id: { equals: user.id } }
    },
    // Tylko admin lub sam użytkownik może edytować
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { id: { equals: user.id } }
    },
    // Tylko admin może usuwać
    delete: ({ req: { user } }) => {
      return user?.roles?.includes('admin') ?? false
    },
  },
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
