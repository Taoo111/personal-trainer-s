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
  hooks: {
    beforeChange: [
      // Zabezpieczenie: tylko admin może ustawiać roles przy tworzeniu
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // Sprawdź czy to pierwszy użytkownik (tworzony przez /admin/create-first-user)
          const existingUsers = await req.payload.find({
            collection: 'users',
            limit: 1,
            overrideAccess: true,
          })

          // Pierwszy użytkownik dostaje rolę admin
          if (existingUsers.totalDocs === 0) {
            data.roles = ['admin']
            return data
          }

          // Jeśli nie admin - wymuś domyślną rolę customer
          if (!req.user?.roles?.includes('admin')) {
            data.roles = ['customer']
          }
        }
        return data
      },
    ],
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
