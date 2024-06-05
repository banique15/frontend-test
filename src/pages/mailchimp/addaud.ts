import type { APIRoute } from 'astro';
import client from './client'
import { camResponses } from '../utility/responses';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    let msg_text = '';
    let isSuccess = false;
    
    const formData = await request.formData();
    console.log(formData);
    
    const action = formData.get('action')?.toString();

    if (action === 'create') {
        // Assuming the action value is "create"
        const name = formData.get('name')?.toString();
        const company = formData.get('company')?.toString();
        const address1 = formData.get('address1')?.toString();
        const city = formData.get('city')?.toString();
        const country = formData.get('country')?.toString();
        const state = formData.get('state')?.toString(); // Get 'state' field from form data
        const zip = formData.get('zip')?.toString(); // Get 'zip' field from form data
        const permission_reminder = formData.get('permission_reminder')?.toString();
        const from_name = formData.get('from_name')?.toString();
        const from_email = formData.get('from_email')?.toString();
        const subject = formData.get('subject')?.toString();
        const language = formData.get('language')?.toString();

        try {
            const response = await client.lists.createList({
                name: name,
                permission_reminder: permission_reminder,
                email_type_option: true,
                contact: {
                    company: company,
                    address1: address1,
                    city: city,
                    country: country,
                    state: state, // Pass 'state' to contact object
                    zip: zip // Pass 'zip' to contact object    
                },
                campaign_defaults: {
                    from_name: from_name,
                    from_email: from_email,
                    subject: subject,
                    language: language,
                },
            });

            if (response.id) {
                msg_text = 'New Campaign added';
                isSuccess = true;
            }
        } catch (e) {
            console.log(e);
            msg_text = 'Campaign creation failed';
            isSuccess = false;
        }
    } else if (action === 'delete') {
        // Use `formData` to get "list_id" instead of "campaign_id" based on your corrected code
        const list_id = formData.get("id")?.toString();
        if (!list_id) {
          console.error("List ID is not provided.");
          msg_text = 'Delete failed: List ID is missing.';
          isSuccess = false;
        } else {
          try {
            // Use `list_id` directly in the delete list call
            const response = await client.lists.deleteList(list_id);
            console.log(response);
            msg_text = 'Delete successful';
            isSuccess = true;
          } catch (error) {
            console.error(`Error: ${error}`);
            msg_text = 'Delete failed';
            isSuccess = false;
          }
        }
    } else if (action === 'update'){
        //update the data
        const name = formData.get('name')?.toString();
        const company = formData.get('company')?.toString();
        const address1 = formData.get('address1')?.toString();
        const city = formData.get('city')?.toString();
        const country = formData.get('country')?.toString();
        const state = formData.get('state')?.toString(); // Get 'state' field from form data
        const zip = formData.get('zip')?.toString(); // Get 'zip' field from form data
        const permission_reminder = formData.get('permission_reminder')?.toString();
        const from_name = formData.get('from_name')?.toString();
        const from_email = formData.get('from_email')?.toString();
        const subject = formData.get('subject')?.toString();
        const language = formData.get('language')?.toString();
        const list_id = formData.get('id')?.toString();
        
        try {
            const response = await client.lists.updateList(list_id, {
                name: name,
                permission_reminder: permission_reminder,
                email_type_option: true,
                contact: {
                    company: company,
                    address1: address1,
                    city: city,
                    country: country,
                    state: state, // Pass 'state' to contact object
                    zip: zip // Pass 'zip' to contact object    
                },
                campaign_defaults: {
                    from_name: from_name,
                    from_email: from_email,
                    subject: subject,
                    language: language,
                },
            });

            if (response.id) {
                msg_text = 'Update successful';
                isSuccess = true;
            }
        } catch (e) {
            console.log(e);
            msg_text = 'Update failed';
            isSuccess = false;
        }
    } else {
        console.log("No action specified or action not supported.");
        msg_text = 'No action specified or action not supported.';
        isSuccess = false;
    }
    
    camResponses.set({'success': isSuccess, 'message': msg_text});
    return redirect('/app');
};