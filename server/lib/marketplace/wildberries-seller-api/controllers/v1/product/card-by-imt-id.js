const request = require('../request');

module.exports = async function cardByImtId(imtId) {
  const response = await request('/card/cardByImtID', 'POST', {
    id: '1',
    jsonrpc: '2.0',
    params: {
      imtId
    }
  });

  if (response.status === 200) return response.json();
  return response;
}