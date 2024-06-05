import type { APIRoute } from 'astro';
import client from './client';

import { camResponses } from '../utility/responses';
let msg_text = '';
let isSuccess = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  
    const formdata = await request.formData();
    const action = formdata.get("action");
    let response = {};
    console.log(action);

    const type = formdata.get('type')?.toString();
    const id = formdata.get('id')?.toString();
    const title = formdata.get('title')?.toString();
    const subject_line = formdata.get('subject_line')?.toString();
    const from_name = formdata.get('from_name')?.toString();
    const reply_to = formdata.get('reply_to')?.toString();
    const to_name = formdata.get('to_name')?.toString();

    if(action=='create'){

      try{
        response = await client.campaigns.create({ 
          "type" : type, 
          "settings" : { 
            "subject_line" : subject_line,
            "from_name" : from_name,
            "reply_to" : reply_to,
            "to_name" : to_name,
            "title" : title,
          } 
        });
      }catch(e){
        console.log(e);
      }

      if(response.id){
        msg_text = 'New Campaign added';
        isSuccess = true;
      }

    }else if(action=='update'){
      try {
        console.log(formdata);
        /// update campaign in mailchimp ///

        try{
          response = await client.campaigns.update(id,{ 
          settings : { 
            "subject_line" : subject_line,
            "from_name" : from_name,
            "reply_to" : reply_to,
            "to_name" : to_name,
            "title" : title,
          } 
          });
          console.log('try');
        }catch(e){
          console.log(e);
        }
        
        if(response?.id){
          isSuccess = true;
          msg_text = 'Update successful';
        }
        
        /// update current display data///
        /**
        data[editkey].settings.subject_line = subject_line;
        data[editkey].settings.title = title;
        data[editkey].settings.from_name = from_name;
        data[editkey].settings.reply_to = reply_to;
        data[editkey].settings.to_name = to_name;**/
  
        
        
        
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          msg_text = 'Update failed';
          isSuccess = false;
        }
      }
     
  
    }else if(action=='delete'){
      try {
        const campaign_id = formdata.get("campaign_id");
  
        /// delete campaign in mailchimp ///
        try {
          const response = await client.campaigns.remove(campaign_id);
          console.log(response);
        } catch (error) {
          console.error(`Error: ${error}`);
        }
  
        /// remove item in the UI data ///
        //data.splice(deletekey, 1);
  
        msg_text = 'Delete successful';
        isSuccess = true;
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          msg_text = 'Delete failed';
          isSuccess = false;
        }
      }
    }
    
    console.log(action);
    camResponses.set({'success':isSuccess,'message':msg_text});
    return redirect('/app');
};

