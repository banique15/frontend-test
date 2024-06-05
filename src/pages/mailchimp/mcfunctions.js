import client from "./client";
import { audienceSelected } from '../utility/responses';

const audience_id = audienceSelected.get(); 

/// handle fetch campaign ///  
export async function campaigns(){
	let data = await client.campaigns.list({
		sort_dir: "DESC",
		sort_field: "create_time"
	});
	return data.campaigns;
}
  
/// handle fetch audience ///  
export async function audiences(){
	let data = await client.lists.getAllLists();
	return data.lists;
}

/// handle fetch subscriber ///  

export async function subscribers(id){
	try {
		let data = await client.lists.getListMembersInfo(id,{
			count: 1000,
			sort_field: 'last_changed',
			sort_dir: 'DESC'
		});
		return data.members;
	} catch(error) {
		console.error(`Error fetching subscribers from Mailchimp: ${error}`);
	}
}

/// handle subscribe and unsubscribe ///  
export async function subscribe(email, status) {
	const response = await client.lists.batchListMembers(audience_id, {
		  update_existing : true,
		  members: [{
			  'email_address':email,
			  'status': status 
		  }],
	});
	console.log(response);
}
  
/// handle search email of member ///  
export async function search(email) {
	const response = await client.searchMembers.search(email);
	//console.log(response.exact_matches.members);
	return response;
}

/// handle search add member ///  
export async function addmember(email) {
	try {
		const response = await client.lists.addListMember(audience_id, {
		email_address: email,
		status: "subscribed"
		});
		console.log(response);
		return response;
	} catch(error) {
		console.error(`Error adding member to Mailchimp: ${error}`);
	}
}  