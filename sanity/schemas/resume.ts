import {defineField, defineType} from 'sanity'

/**
 * Resume — singleton document.
 * Upload the PDF once via Sanity Studio. Re-uploading replaces the
 * previous file without any code changes required.
 *
 * To enforce singleton behaviour in the Studio (prevent creating
 * additional documents), restrict __experimental_actions to
 * ['update', 'publish'] inside sanity.config.ts, following the
 * same pattern used for the hero schema.
 */
export const resumeSchema = defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    defineField({
      name: 'showDownloadButton',
      title: 'Show Resume Download Button',
      type: 'boolean',
      description: 'Toggle off to hide the resume download button from the portfolio without deleting the PDF.',
      initialValue: true,
    }),
    defineField({
      name: 'file',
      title: 'Resume PDF',
      type: 'file',
      description: 'Upload the latest resume here. Re-uploading replaces the previous version automatically.',
      options: {
        accept: 'application/pdf',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Resume',
        subtitle: 'Singleton — one document only',
      }
    },
  },
})
