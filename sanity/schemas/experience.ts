import {defineField, defineType} from 'sanity'

/**
 * Experience supports two authoring modes:
 * 1. Simple single-role entry using the legacy top-level fields.
 * 2. Company entry with multiple nested roles using the `roles` array.
 */
export const experienceSchema = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value || typeof value !== 'object') return true

      const doc = value as {
        role?: string
        dates?: string
        bulletPoints?: string[]
        roles?: Array<unknown>
      }

      const hasLegacySingleRole =
        Boolean(doc.role?.trim()) &&
        Boolean(doc.dates?.trim()) &&
        Array.isArray(doc.bulletPoints) &&
        doc.bulletPoints.length > 0

      const hasMultiRoleArray =
        Array.isArray(doc.roles) &&
        doc.roles.length > 0

      if (hasLegacySingleRole || hasMultiRoleArray) return true

      return 'Add either one top-level role with dates and bullet points, or at least one entry in the Roles array.'
    }),
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
      description: 'Use this for a single-role company entry. Leave blank if you are using the Roles array below.',
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
    }),

    defineField({
      name: 'bulletPoints',
      title: 'Bullet Points',
      type: 'array',
      description: 'Impact highlights shown when the accordion card is expanded for a single-role entry.',
      of: [{type: 'string'}],
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
      name: 'displayDates',
      title: 'Company Summary Dates',
      type: 'string',
      description: 'Optional summary shown on the collapsed row for a multi-role company, for example "2021 - Present".',
    }),

    defineField({
      name: 'roles',
      title: 'Roles',
      type: 'array',
      description: 'Use this when one company contains multiple roles over time.',
      of: [
        {
          type: 'object',
          name: 'experienceRole',
          title: 'Role',
          fields: [
            defineField({
              name: 'order',
              title: 'Role Order',
              type: 'number',
              description: 'Lower numbers appear first within the company.',
              validation: (Rule) => Rule.required().integer().positive(),
            }),
            defineField({
              name: 'role',
              title: 'Job Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'dates',
              title: 'Duration',
              type: 'string',
              description: 'Optional sub-duration for this role. Leave blank if the company-level summary dates are enough.',
            }),
            defineField({
              name: 'bulletPoints',
              title: 'Bullet Points',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'skillsUsed',
              title: 'Skills Used',
              type: 'array',
              of: [{type: 'string'}],
              options: {
                layout: 'tags',
              },
            }),
          ],
          preview: {
            select: {
              title: 'role',
              subtitle: 'dates',
            },
          },
        },
      ],
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
      roles: 'roles',
      hidden: 'isHidden',
      order: 'order',
    },
    prepare({title, subtitle, roles, hidden, order}) {
      const roleCount = Array.isArray(roles) ? roles.length : 0
      const modeLabel =
        roleCount > 0
          ? `${roleCount} role${roleCount === 1 ? '' : 's'}`
          : (subtitle ?? '')

      return {
        title: `${order != null ? `${order}. ` : ''}${title ?? 'Untitled'}`,
        subtitle: `${modeLabel}${hidden ? '  ·  hidden' : ''}`,
      }
    },
  },
})
