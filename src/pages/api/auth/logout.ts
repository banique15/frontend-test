import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ cookies, redirect }) => {
	const { error } = await supabase.auth.signOut();

	// Delete the cookies
	cookies.set('sb-access-token', '', {
		path: '/',
		expires: new Date(0),
	});
	cookies.set('sb-refresh-token', '', {
		path: '/',
		expires: new Date(0),
	});

	return redirect('/login');
};
