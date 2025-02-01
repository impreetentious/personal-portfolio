import {defineField, defineType} from 'sanity'

export const achievementsSchema = defineType({
  name: 'achievements',
  title: 'Achievements',
  type: 'document',
  fields: [
    defineField({
      name: 'highlightText',
      title: 'Highlight Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'highlightText',
      subtitle: 'year',
    },
  },
})
