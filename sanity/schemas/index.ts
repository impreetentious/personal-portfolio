/**
 * Central schema registry for the Sanity studio.
 * Add every new schema here AND to the schemaTypes array below.
 * The order of schemaTypes controls the order of document types
 * in the Sanity studio sidebar.
 */

import { heroSchema } from './hero'
import { resumeSchema } from './resume'
import { experienceSchema } from './experience'
import { projectsSchema } from './projects'
import { metricsSchema } from './metrics'
import { educationSchema } from './education'
import { skillsSchema } from './skills'
import { achievementsSchema } from './achievements'
import { writingSchema } from './writing'

export const schemaTypes = [
  // Singletons
  heroSchema,
  resumeSchema,

  // Ordered collections
  experienceSchema,
  projectsSchema,
  metricsSchema,

  // Supporting sections
  educationSchema,
  skillsSchema,
  achievementsSchema,
  writingSchema,
]
