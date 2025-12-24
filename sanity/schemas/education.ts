import { defineField, defineType } from 'sanity'

export const educationSchema = defineType({
  name: 'education',
  title: 'Education',
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
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'years',
      title: 'Years',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gpa',
      title: 'GPA / Score',
      type: 'string',
      description: 'Optional score line rendered beneath the degree.',
    }),
    defineField({
      name: 'isHidden',
      title: 'Hide this entry',
      type: 'boolean',
      description: 'Toggle on to suppress this education record without deleting it.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'institution',
      subtitle: 'degree',
      order: 'order',
      hidden: 'isHidden',
    },
    prepare({ title, subtitle, order, hidden }) {
      return {
        title: `${order != null ? `${order}. ` : ''}${title ?? 'Untitled'}`,
        subtitle: `${subtitle ?? ''}${hidden ? '  ·  hidden' : ''}`,
      }
    },
  },
})
