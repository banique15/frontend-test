import { supabase } from './lib/supabase';

export async function onRequest({ locals }, next) {
	const { data, error } = await supabase.auth.getSession();
	console.log(data, error);

	if (data && data.session) {
		console.log('User is logged in');
		locals.isLoggedIn = true;
		locals.message = 'User is logged in';
		locals.email = data.session.user.email;
		locals.session = data.session;
	} else {
		console.log('No active session');
		locals.isLoggedIn = false;
		locals.message = 'No active session';
		locals.email = null;
	}

	return next();
}
