import {defineField, defineType} from 'sanity'

export const writingSchema = defineType({
  name: 'writing',
  title: 'Writing',
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
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'url',
      title: 'Article URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Short display value such as "2024".',
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: 'isHidden',
      title: 'Hide this entry',
      type: 'boolean',
      description: 'Toggle on to suppress this article without deleting it.',
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
      title: 'title',
      subtitle: 'year',
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
