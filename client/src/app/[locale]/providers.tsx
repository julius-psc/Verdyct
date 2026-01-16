'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: true, // Enable pageviews (blocked by opt_out_capturing_by_default until consent)
        autocapture: true, // Enable interactions (blocked by opt_out_capturing_by_default until consent)
        opt_out_capturing_by_default: true, // IMPORTANT: Respect GDPR by default
    })
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
