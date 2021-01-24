import { route } from './../../api/routes/api/v1/_TEMPLATE';
import {logger} from "../../utils";
const request = require('centra');

const baseUrl = '';

const headers = {
	'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
	Accept: 'application/json',
	'X-Auth-Token': ''
};

const setToken = (authToken:any) => {
	headers['X-Auth-Token'] = authToken;
};

const req = async (route:String, method:String, body:any):Promise<any> => {
	
	const fetch = request(route, method);
	fetch.reqHeaders = headers;
	const res = await fetch.body(body).send();
	if (res.statusCode >= 200 && res.statusCode < 300) {
		try {
			return res.json;
		} catch {
			return { status: res.statusCode };
		}
	} else if (res.statusCode >= 400 && res.statusCode < 500) {
		logger.info(res.statusCode)
	} else {
		logger.warning(`reattempting, status code: ${res.statusCode}`);
		return await req(route, method, body);
	}
};

const get = async (route:String) => await req(route, 'GET', '');

const post = async (route:String, body:any) => await req(route, 'POST', body);

const patch = async(route:String, body:any) => await req(route, 'PATCH', body)

const put = async (route:String, body:any) => await req(route, 'PUT', body);

const del = async (route:String) => await req(route, 'DELETE', '');

export default {
	setToken,
	get,
	post,
	patch,
	put,
	delete: del
};