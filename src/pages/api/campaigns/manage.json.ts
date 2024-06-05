export const prerender = false;


import type { APIRoute } from 'astro';
import client from '../../mailchimp/client';

export const POST: APIRoute = async ({ request }) => {

  
  // Get email from the form data
  const formData = await request.json();
  let getData = {}, getContent = {};
  const content = formData.content;
  const action = formData.action;
  const schedule = formData.schedule;
  const list_id = formData.list_id;
  console.log(formData);
  // First, search the email in Mailchimp

  let responseMC = false;
  let msg = '';

    if(action == 'content'){
      const campaign_id = formData.managecampaigncont_id;

      try {
        const response = await client.campaigns.setContent(campaign_id, {
          "plain_text": content
        });
        responseMC = true;
        msg = 'Template Successfully Added';
        console.log(response);   
      } catch (e) {
        console.error(`Campaign Content Error : ${e}`);
        msg = 'Update content failed';
      }

     
    }else if(action == 'schedule'){
      const campaign_id = formData.managecampaignsche_id;

      var date = new Date(schedule);
  
      console.log(date.toISOString());

      try{
        const response = await client.campaigns.schedule(campaign_id, {
          schedule_time: date.toISOString(),
        });
        responseMC = true;
        msg = 'Schedule Successfully Set';
        console.log(response);

      }catch(e){
        console.error(`Campaign Schedule Error : ${e}`);
        msg = 'Set schedule failed';
      }
    }else if(action=='read'){
      
      const campaign_id = formData.id;

      /// get campaign in mailchimp ///
      try {
        const responseContent = await client.campaigns.getContent(campaign_id);
        responseMC = true;
        getContent = responseContent;
        msg = 'Success';
      } catch (error) {
        msg = 'Failed';
        console.error(`Error: ${error}`);
      }

      try {
        const responseData = await client.campaigns.get(campaign_id);
        
        console.log(responseData);
        responseMC = true;
        getData = responseData;
        msg = 'Success';;
      } catch (error) {
        msg = 'Failed';
        console.error(`Error: ${error}`);
      }

    }else if(action=='set-audience'){
      
      const campaign_id = formData.managecampaignsetaud_id;
      const list_id = formData.audience;
      console.log(formData);
      /// get campaign in mailchimp ///
      try {
        const responseContent = await client.campaigns.update(campaign_id, {
          recipients: {
            list_id: list_id,
          },
        });

        responseMC = true;
        getContent = responseContent;
        msg = 'Success';
      } catch (error) {
        msg = 'Failed';
        console.error(`Error: ${error}`);
      }

    }
    
    return new Response(JSON.stringify({
      content: getContent,
      data: getData,
      message: msg,
      status: responseMC    
    })
  );
      
};
