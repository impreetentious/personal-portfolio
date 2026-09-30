// Used only by the `sanity` CLI for deploys; the app never imports this file.
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
})
