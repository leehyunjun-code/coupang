const crypto = require('crypto');

function generateHmac(method, path, query, secretKey, accessKey) {
  const now = new Date();
  const datetime = now.toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
    .slice(2); // yymmddTHHMMSSZ 형식
  
  const message = datetime + method + path + query;
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
  
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

async function getRecentOrders(vendorId, accessKey, secretKey, dateFrom, dateTo) {
  const method = 'GET';
  const path = `/v2/providers/rg_open_api/apis/api/v1/vendors/${vendorId}/rg/orders`;
  const query = `paidDateFrom=${dateFrom}&paidDateTo=${dateTo}`;
  
  const authorization = generateHmac(method, path, query, secretKey, accessKey);
  
  const url = `https://api-gateway.coupang.com${path}?${query}`;
  
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization
    }
  });
  
  const data = await response.json();
  return data.data || [];
}

module.exports = { getRecentOrders };