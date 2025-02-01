import {defineField, defineType} from 'sanity'

/**
 * Projects — one document per project.
 * Query with `order(order asc)` in GROQ to control display sequence.
 * Set `isHidden: true` to suppress an entry without deleting it.
 * Set `featured: true` to surface a project in any highlight / hero treatment.
 */
export const projectsSchema = defineType({
  name: 'projects',
  title: 'Projects',
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
      description: 'Project name as shown on the card.',
      validation: (Rule) => Rule.required().max(80),
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences describing what the project does and why it matters.',
      validation: (Rule) => Rule.required().max(280),
    }),

    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      description: 'Technologies, frameworks, and tools used. Rendered as pill tags on the card.',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      description: 'Link to the deployed project. Leave blank if not publicly hosted.',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      description: 'Link to the source repository. Leave blank for private or NDA work.',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark as featured to surface this project in any highlight treatment.',
      initialValue: false,
    }),

    defineField({
      name: 'isHidden',
      title: 'Hide this entry',
      type: 'boolean',
      description: 'Toggle on to suppress this project from the portfolio without deleting the record.',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      featured: 'featured',
      hidden: 'isHidden',
      order: 'order',
    },
    prepare({title, subtitle, featured, hidden, order}) {
      const flags = [featured && '★ featured', hidden && 'hidden']
        .filter(Boolean)
        .join('  ·  ')

      return {
        title: `${order != null ? `${order}. ` : ''}${title ?? 'Untitled'}`,
        subtitle: flags ? `${flags}  —  ${subtitle ?? ''}` : (subtitle ?? ''),
      }
    },
  },
})
