import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { loginCustomer, customerInfoByToken} from '../../../utils/shopify';


export const POST: APIRoute = async ({ request, cookies, redirect }) => {

	const { email, password } = await request.json();

	if (!email || !password) {
		return new Response('Email and password are required', { status: 400 });
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return new Response(error.message, { status: 500 });
	}

	const data_shopify = await loginCustomer({email: email, password: password});

	
	const shopify_access_token = data_shopify.customerAccessTokenCreate?.customerAccessToken?.accessToken;

	const customer_data = await customerInfoByToken({token: shopify_access_token});
	console.log('customer_ID');
	console.log(customer_data);
	const shopify_customer_id = customer_data.customer.id;

	if (!shopify_access_token) {
		return new Response('Failed to create Shopify access token', { status: 500 });
	}

	if (!customer_data) {
		return new Response('Failed to get Shopify Customer Data', { status: 500 });
	}

	const { access_token, refresh_token } = data.session;

	cookies.set('sb-access-token', access_token, {
		path: '/',
	});
	cookies.set('sb-refresh-token', refresh_token, {
		path: '/',
	});
	cookies.set('sf-access-token', shopify_access_token, {
		path: '/',
	});
	cookies.set('sf-customer-id', shopify_customer_id, {
		path: '/',
	});

	// Return email and is_auth flag in the response
	return new Response(JSON.stringify({ email, is_auth: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
