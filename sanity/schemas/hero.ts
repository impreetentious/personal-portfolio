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
      description: 'Ordered list of links reused across the site, including the Contact section.',
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
                  {title: 'Phone', value: 'phone'},
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
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Controls display order. Lower numbers appear first.',
              validation: (Rule) => Rule.integer().min(0),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Button label shown in the UI. Falls back to the platform name if left blank.',
            }),
            defineField({
              name: 'copyValue',
              title: 'Copy Value',
              type: 'string',
              description: 'Optional plain-text value copied on click for items like phone or email.',
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

    defineField({
      name: 'profileFields',
      title: 'Terminal Profile Fields',
      type: 'array',
      description: 'Rows shown in the hero terminal properties block, such as Location, Email, Phone, and LinkedIn.',
      of: [
        {
          type: 'object',
          name: 'profileField',
          fields: [
            defineField({
              name: 'key',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'url',
              description: 'Optional clickable URL such as mailto:, tel:, or https://...',
              validation: (Rule) =>
                Rule.uri({
                  allowRelative: false,
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            }),
            defineField({
              name: 'column',
              title: 'Column',
              type: 'string',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'},
                ],
                layout: 'radio',
              },
              initialValue: 'left',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'key',
              subtitle: 'value',
            },
          },
        },
      ],
    }),

    defineField({
      name: 'terminalSkills',
      title: 'Terminal Skills',
      type: 'array',
      description: 'Skill chips shown in the hero terminal skills strip.',
      of: [
        {
          type: 'object',
          name: 'terminalSkill',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'dot',
              title: 'Dot Color',
              type: 'string',
              description: 'Hex color for the small glowing dot, for example #61AFEF.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'dot',
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
