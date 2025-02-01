import {defineField, defineType} from 'sanity'

/**
 * Skills — one document per category (Tools / Skills).
 *
 * SCHEMA CHANGE (destructive):
 *   `items` was previously an array of primitive strings.
 *   It is now an array of objects so each entry can carry an optional
 *   `description` field for hover tooltips in the UI.
 *
 *   If you have existing Sanity documents using the old shape, you will
 *   need to migrate those records in the Studio before the new UI can
 *   render them correctly.
 */
export const skillsSchema = defineType({
  name: 'skills',
  title: 'Skills',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Tools', value: 'Tools'},
          {title: 'Skills', value: 'Skills'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description:
        'Each entry has a required display name and an optional tooltip description (max 120 characters).',
      of: [
        {
          type: 'object',
          name: 'skillItem',
          title: 'Skill Item',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'Display label shown as the pill tag in the UI.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description:
                'Optional tooltip text shown on hover. Keep it under 120 characters.',
              validation: (Rule) => Rule.max(120),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: {
      title: 'category',
    },
  },
})
