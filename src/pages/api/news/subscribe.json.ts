
import type { APIRoute } from 'astro';
import client from '../../mailchimp/client';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  
  // Get email from the form data
  const formData = await request.json();
  const email = formData.email;

  // First, search the email in Mailchimp

  let searchdata;
  let responseMC = false;
  let responseSB = false;
  let msg = '';
  let stat = 0;

  try {
    const response = await client.searchMembers.search(email);
    console.log(response);
    searchdata = response;    
  } catch (error) {
    console.error(`Mailchimp Error : ${error}`);
  }

  // If email is not found in Mailchimp, add it
  if (!searchdata || !searchdata.exact_matches || !searchdata.exact_matches.total_items) {
    try {
      const response = await client.lists.addListMember("6fbabdedf8", {
        email_address: email,
        status: "subscribed"
      });
      console.log(response);
      responseMC = true;
    } catch(error) {
      console.error(`Error adding member to Mailchimp: ${error}`);
    }
  }




  // Then, search the email/user in Supabase
  let { data, } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${email}%`)

  // If user is found in Supabase
  if (data && data.length > 0) {
    console.log('Email Found!');
  } else {

    // If not found, create a new user in Supabase.
    try {
      let { user: newUser, error } = await supabase.auth.signUp({
        email: email ?? '',
        password: 'somePassword' // You would want to get this from your formData or a secure source
      });
  
      if (error) {
        console.error('Error creating user in Supabase', error);
      } else {
        console.log('User created in Supabase', newUser);
        responseSB = true;
      }
    } catch(error) {
      console.error(`Supabase error: ${error}`);
    }
  }

  if(responseMC && responseSB){ /// email cant be found in mailchimp and supabase add it  ///
    msg = 'Welcome to the Sing for Hope family! You have just taken a step towards transforming lives through the power of the arts. Stay tuned for inspiring stories, exciting events, and opportunities to make a difference with us.';
    stat = 1;
  }else if(responseMC && !responseSB){ /// email added only and mailchimp  ///
    msg = 'You are now a subscriber.';
    stat = 2;
  }else if(!responseMC && responseSB){ /// email added only and Supabase  ///
    msg = 'You’re now added to our newsletter. Please login to your account';
    stat = 3;
  }else if(!responseMC && !responseSB){ /// Email already in Supabase & MC  ///
    msg = 'It looks like you are already a valued member of the Sing for Hope community! Thank you for your continued support and passion for spreading the joy of the arts. Keep an eye on your inbox for the latest news and updates from us.';
    stat = 4;
  }

  return new Response(JSON.stringify({
      message: msg,
      status: stat    
    })
  );

};
