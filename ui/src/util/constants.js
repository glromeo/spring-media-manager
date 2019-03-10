import base64 from "base-64";

const username = 'proxy_username';
const password = 'proxy_password';

export const HTTP_HEADERS = {'Authorization': `Basic ${base64.encode(username + ":" + password)}`};
