/**
 * Social links and external URLs.
 * Uses NEXT_PUBLIC_* env vars (standardized naming).
 * Falls back to VITE_* for backwards compatibility during migration.
 */

function getEnv( key: string, fallback?: string ): string | undefined {
  return ( process.env as Record<string, string | undefined> )[key] || fallback;
}

export const SOCIAL_LINKS = {
  portfolio:   getEnv( 'NEXT_PUBLIC_PORTFOLIO_URL' )   ?? '',
  github:      getEnv( 'NEXT_PUBLIC_GITHUB_URL' )      ?? '',
  linkedin:    getEnv( 'NEXT_PUBLIC_LINKEDIN_URL' )     ?? '',
  x:           getEnv( 'NEXT_PUBLIC_X_URL' )           ?? '',
  instagram:   getEnv( 'NEXT_PUBLIC_INSTAGRAM_URL' )    ?? '',
  youtube:     getEnv( 'NEXT_PUBLIC_YOUTUBE_URL' )      ?? '',
  facebook:    getEnv( 'NEXT_PUBLIC_FACEBOOK_URL' )     ?? '',
  figma:       getEnv( 'NEXT_PUBLIC_FIGMA_URL' )        ?? '',
  freelas99:   getEnv( 'NEXT_PUBLIC_99FREELAS_URL' )    ?? '',
  workana:     getEnv( 'NEXT_PUBLIC_WORKANA_URL' )      ?? '',
  buyMeACoffee:getEnv( 'NEXT_PUBLIC_BUYMEACOFFEE_URL' ) ?? '',
  contactEmail:getEnv( 'NEXT_PUBLIC_CONTACT_EMAIL' )    ?? '',
} as const;

export const ANALYTICS = {
  gaMeasurementId: getEnv( 'NEXT_PUBLIC_GA_MEASUREMENT_ID' ) ?? '',
  gtmId:           getEnv( 'NEXT_PUBLIC_GTM_ID' )            ?? '',
  counterDevId:    getEnv( 'NEXT_PUBLIC_COUNTER_DEV_ID' )     ?? '',
} as const;
