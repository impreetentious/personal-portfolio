import {defineField, defineType} from 'sanity'

/**
 * Hero — singleton document.
 * One entry is expected. To enforce singleton behaviour in the studio,
 * configure this type inside sanity.config.ts using the singletonPlugin
 * or by restricting __experimental_actions to ['update', 'publish'].
 */
export const heroSchema = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name displayed as the large heading.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short line rendered with the typewriter animation below your name.',
      validation: (Rule) => Rule.required().max(120),
    }),

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Supporting paragraph shown beneath the tagline.',
      validation: (Rule) => Rule.required().max(320),
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Ordered list of links rendered as CTA buttons in the Hero section.',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Email', value: 'email'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'WhatsApp', value: 'whatsapp'},
                  {title: 'GitHub', value: 'github'},
                  {title: 'Twitter / X', value: 'twitter'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Full URL including scheme — e.g. mailto:you@example.com or https://linkedin.com/in/you',
              validation: (Rule) =>
                Rule.required().uri({
                  allowRelative: false,
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Button label shown in the UI. Falls back to the platform name if left blank.',
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
    },
  },
})
