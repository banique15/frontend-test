import type { APIRoute } from 'astro';
import client from './client';
import CryptoJS  from "crypto-js";
import { subResponses, audienceSelected } from '../utility/responses';
import { createClient } from '@supabase/supabase-js';


let msg_text = '';
let isSuccess = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
   const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
      },
    }
  );
    const audience_id = audienceSelected.get(); 
    const formdata = await request.formData();
    const action = formdata.get("action");
    let response = {};
    console.log(action);

    const status = formdata.get('status')?.toString();
    const lname = formdata.get('lname')?.toString();
    const fname = formdata.get('fname')?.toString();
    const email = formdata.get('email_address')?.toString();

    if(action=='create'){

      try {
        response = await client.lists.addListMember(audience_id, {
          email_address: email,
          status: status, 
          merge_fields: {
            FNAME: fname,
            LNAME: lname
          }
        });

        if (response.id) {
          msg_text = 'New member added';
          isSuccess = true;
        }

        // Add data to Supabase table "profiles"
        const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: response.id,
            username: email,
            first_name: fname,
            last_name: lname
          }
        ]);

        if (error) {
          console.error(error.message);
          msg_text = 'Failed to add data to Supabase';
          isSuccess = false;
        }
      } catch (e) {
        console.log(e);
      }

    }else if(action=='update'){
      try {
        console.log(formdata);
        /// update campaign in mailchimp ///

        try{
          try {
            response = await client.lists.setListMember(audience_id, CryptoJS.MD5(email.toLowerCase()), {
              email_address: email,
              status: status,
              merge_fields: {
                FNAME: fname,
                LNAME: lname
              }
            });

            if (response?.id) {
              msg_text = 'Update successful';
              isSuccess = true;

              // Update data in Supabase table "profiles"
              const { error } = await supabase
                .from('profiles')
                .update({
                  first_name: fname,
                  last_name: lname
                })
                .eq('username', email);

              if (error) {
                console.error(error.message);
                msg_text = 'Failed to update data in Supabase';
                isSuccess = false;
              }
            }
          } catch (e) {
            console.log(e);
          }
          console.log('try');
        }catch(e){
          console.log(e);
        }
        
        if(response?.id){
          isSuccess = true;
          msg_text = 'Update successful';
        }
        
        
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          msg_text = 'Update failed';
          isSuccess = false;
        }
      }
     
  
    }else if(action=='delete'){
try {
  // Fetch campaign member's data from mailchimp
  let memberResponse = await client.lists.getListMember(audience_id, 
                                   CryptoJS.MD5(email.toLowerCase()).toString());

  if (memberResponse && memberResponse.email_address) {
    const emailAddress = memberResponse.email_address;

    // Delete campaign member in Mailchimp
    let deleteResponse = await client.lists.deleteListMember(
                                  audience_id, 
                                  CryptoJS.MD5(emailAddress.toLowerCase()).toString()
                                );

    // If deletion was successful in Mailchimp or not doesn't affect Supabase operation since we already have the email address.
  
    // Delete data from Supabase table "profiles"
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('username', emailAddress);

    if (error) {
      console.error(error.message);
      msg_text = 'Failed to delete data from Supabase';
      isSuccess = false;
    } else {
      msg_text = 'Delete successful';
      isSuccess = true;
    }
  } else {
    msg_text = 'Member data could not be fetched';
    isSuccess = false;
  }

} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    msg_text = 'Operation failed';
    isSuccess = false;
  }
}
    }
    console.log(action);
    subResponses.set({'success':isSuccess,'message':msg_text});
    return redirect('/app');
};

