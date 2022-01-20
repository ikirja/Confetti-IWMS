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
  const jsonData = await response.json();

  return jsonData;
}