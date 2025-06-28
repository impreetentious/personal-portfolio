import {defineField, defineType} from 'sanity'

export const achievementsSchema = defineType({
  name: 'achievements',
  title: 'Achievements',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Use whole numbers — 1, 2, 3.',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'Display string shown in the table, for example "Nov 2024".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'string',
      description: 'Short highlight shown next to the date, for example "1st of 400+ teams".',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Expanded Description',
      type: 'text',
      rows: 5,
      description: 'Optional longer detail revealed when the table row is expanded.',
      validation: (Rule) => Rule.max(600),
    }),
    defineField({
      name: 'isHidden',
      title: 'Hide this achievement',
      type: 'boolean',
      description: 'Toggle on to suppress this item without deleting the record.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'event',
      subtitle: 'organizer',
      order: 'order',
      hidden: 'isHidden',
    },
    prepare({title, subtitle, order, hidden}) {
      return {
        title: `${order != null ? `${order}. ` : ''}${title ?? 'Untitled'}`,
        subtitle: `${subtitle ?? ''}${hidden ? '  ·  hidden' : ''}`,
      }
    },
  },
})
