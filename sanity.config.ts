import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from '@/sanity/schemas'

// Hero and Resume use stable document IDs so the Studio can create them on a
// new dataset without also exposing duplicate-document paths.
const singletonTypes = new Set(['hero', 'resume'])

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .id('hero')
              .title('Hero')
              .child(S.document().schemaType('hero').documentId('hero')),
            S.listItem()
              .id('resume')
              .title('Resume')
              .child(S.document().schemaType('resume').documentId('resume')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? '')),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Fixed singleton panes above are the only creation paths for these types.
    newDocumentOptions: (prev) =>
      prev.filter((template) => !singletonTypes.has(template.templateId)),
    // A singleton can be edited or deleted, but never duplicated.
    actions: (prev, context) =>
      singletonTypes.has(context.schemaType)
        ? prev.filter(({ action }) => action !== 'duplicate')
        : prev,
  },
})
