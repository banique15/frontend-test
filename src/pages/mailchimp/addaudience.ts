import type { APIRoute } from 'astro';
import client from './client'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  
  const formData = await request.formData();
  console.log(formData);
  const name = formData.get('name')?.toString();
  const company = formData.get('company')?.toString();
  const address1 = formData.get('address1')?.toString();
  const city = formData.get('city')?.toString();
  const country = formData.get('country')?.toString();
  const state = formData.get('state')?.toString();
  const zip = formData.get('zip')?.toString();
  const permission_reminder = formData.get('permission_reminder')?.toString();
  const from_name = formData.get('from_name')?.toString();
  const from_email = formData.get('from_email')?.toString();
  const subject = formData.get('subject')?.toString();
  const language = formData.get('language')?.toString();
  try {
    const response = await client.lists.createList({
      "name": "New Audience Name",
      "permission_reminder": "permission_reminder",
      "email_type_option": true,
      "contact": {
        "company": "Shangrila",
        "address1": "Shaw Blvd",
        "city": "Mandaluyong",
        "state": "Manila",
        "country": "Philippines",
        "zip": "1900"
      },
      "campaign_defaults": {
        "from_name": "Jose",
        "from_email": "ryanFlick@gmail.com",
        "subject": "Email to All",
        "language": "Filipino"
      }
    });
    console.log(response);
  }catch(error){
    console.error(error)
  }
};

  