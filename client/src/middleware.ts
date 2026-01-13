import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './utils/supabase/middleware';
import { NextRequest } from 'next/server';

const handleI18n = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const response = handleI18n(request);
    return await updateSession(request, response);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(fr|en)/:path*']
};
