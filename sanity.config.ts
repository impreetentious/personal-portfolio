import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from '@/sanity/schemas'

// Hero and Resume are singletons by contract (one document each — see their
// schema docblocks), and the frontend reads `[0]`, so a duplicate would
// silently swap live content. Block every way the Studio can mint a second
// copy; Delete stays available so an accidental extra can still be cleaned up.
// (On a brand-new empty dataset, create the first hero/resume via the CLI or
// temporarily lift these guards.)
const singletonTypes = new Set(['hero', 'resume'])

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Remove hero/resume from every "create new document" entry point
    // (global create menu and the structure pane's + button alike).
    newDocumentOptions: (prev) =>
      prev.filter((template) => !singletonTypes.has(template.templateId)),
    // ...and drop their per-document Duplicate action.
    actions: (prev, context) =>
      singletonTypes.has(context.schemaType)
        ? prev.filter(({ action }) => action !== 'duplicate')
        : prev,
  },
})
