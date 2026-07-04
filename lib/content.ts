/** Return CMS data when available, otherwise use optional demo content. */
export function resolveSectionData<T>(
  cmsData: T[] | null | undefined,
  demoData: T[],
  useDemoData: boolean,
): T[] {
  if (cmsData?.length) return cmsData
  if (useDemoData) return demoData
  return []
}

/** Demo content is automatic in development and explicitly opt-in elsewhere. */
export function shouldUseDemoContent(opts: {
  nodeEnv: string | undefined
  envFlag: string | undefined
}): boolean {
  return opts.nodeEnv !== 'production' || opts.envFlag === 'true'
}

/** Decide whether a CMS request failure must abort the current render. */
export function shouldPropagateCmsError(opts: {
  nodeEnv: string | undefined
  nextPhase: string | undefined
  allowBuildWithoutSanity: string | undefined
}): boolean {
  if (opts.nodeEnv !== 'production') return false
  if (opts.nextPhase !== 'phase-production-build') return true
  return opts.allowBuildWithoutSanity !== 'true'
}
