import {defineField, defineType} from 'sanity'

/**
 * Metrics — one document per animated counter stat.
 *
 * Each record maps directly to an AnimatedCounter instance in the UI:
 *   `${prefix}${value}${suffix}` → e.g. "$2.5M", "98%", "4x"
 *
 * Query with `order(order asc)` in GROQ to control display sequence.
 *
 * Example GROQ:
 *   *[_type == "metrics"] | order(order asc) {
 *     order, value, prefix, suffix, label
 *   }
 */
export const metricsSchema = defineType({
  name: 'metrics',
  title: 'Metrics',
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
      name: 'value',
      title: 'Value',
      type: 'number',
      description:
        'The numeric target the counter animates up to. Supports decimals — e.g. 2.5 renders as "2.5", while 4.0 renders as "4".',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'prefix',
      title: 'Prefix',
      type: 'string',
      description:
        'Optional character(s) prepended before the number — e.g. "$", "~", "€". Leave blank if not needed.',
    }),

    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description:
        'Optional character(s) appended after the number — e.g. "%", "x", "+", "M". Leave blank if not needed.',
    }),

    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description:
        'Short descriptor rendered below the counter — e.g. "Projects Shipped", "Client Satisfaction".',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'sub',
      title: 'Supporting Text',
      type: 'string',
      description:
        'Short secondary line rendered beneath the main label.',
      validation: (Rule) => Rule.max(120),
    }),

    defineField({
      name: 'isHidden',
      title: 'Hide this metric',
      type: 'boolean',
      description: 'Toggle on to suppress this metric without deleting the record.',
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
      title: 'label',
      value: 'value',
      prefix: 'prefix',
      suffix: 'suffix',
      order: 'order',
    },
    prepare({title, value, prefix, suffix, order}) {
      const formatted =
        value != null
          ? `${prefix ?? ''}${value}${suffix ?? ''}`
          : ''
      return {
        title: `${order != null ? `${order}. ` : ''}${title ?? 'Untitled'}`,
        subtitle: formatted,
      }
    },
  },
})
