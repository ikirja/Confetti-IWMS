import store from '@/store';

export default async function request(url, method, token, body) {
  let options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      token
    }
  }

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (response.status === 401) return store.dispatch('logout');

  const jsonData = await response.json();

  return jsonData;
}