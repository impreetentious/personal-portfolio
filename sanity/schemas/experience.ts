import {defineField, defineType} from 'sanity'

/**
 * Experience — one document per role.
 * Query with `order(order asc)` in GROQ to control display sequence.
 * Set `isHidden: true` to suppress an entry without deleting it.
 */
export const experienceSchema = defineType({
  name: 'experience',
  title: 'Experience',
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
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Remote, Chandigarh, India',
    }),

    defineField({
      name: 'dates',
      title: 'Duration',
      type: 'string',
      description: 'Display string shown on the card — e.g. "2022 – 2024" or "Jan 2023 – Present".',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'bulletPoints',
      title: 'Bullet Points',
      type: 'array',
      description: 'Impact highlights shown when the accordion card is expanded.',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'skillsUsed',
      title: 'Skills Used',
      type: 'array',
      description: 'Tags rendered as pills inside the expanded card.',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),

    defineField({
      name: 'isHidden',
      title: 'Hide this entry',
      type: 'boolean',
      description: 'Toggle on to suppress this role from the portfolio without deleting the record.',
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
      title: 'company',
      subtitle: 'role',
      hidden: 'isHidden',
      order: 'order',
    },
    prepare({title, subtitle, hidden, order}) {
      return {
        title: `${order != null ? `${order}. ` : ''}${title ?? 'Untitled'}`,
        subtitle: `${subtitle ?? ''}${hidden ? '  ·  hidden' : ''}`,
      }
    },
  },
})
