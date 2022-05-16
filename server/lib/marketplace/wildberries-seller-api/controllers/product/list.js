const request = require('../request');

module.exports = async function list(limit) {
  const response = await request('/card/list', 'POST', {
    id: '1',
    jsonrpc: "2.0",
    params: {
      query: {
        limit: limit,
        offset: 0
      },
      withError: false
    }
  });

  if (response.status === 200) return response.json();
  return response;
}