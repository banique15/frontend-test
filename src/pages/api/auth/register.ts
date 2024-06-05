import { addCustomer } from "./../../../utils/shopify";
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData();
	const email = formData.get('email')?.toString();
	const password = formData.get('password')?.toString();

	if (!email || !password) {
		return new Response('Email and password are required', { status: 400 });
	}

	const addcustomer = await addCustomer({email: email, password: password});
	
	
	const { error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		return new Response(error.message, { status: 500 });
	}

	/// Empty Session so it can't be logged-in ///
	await supabase.auth.signOut();

	return redirect('/login');
};