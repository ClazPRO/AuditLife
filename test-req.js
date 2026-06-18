// Use environment variable for URL to avoid hardcoded cleartext HTTP protocol
const apiUrl = process.env.API_URL || 'https://localhost:3000/api/chat';

fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'halo' }] })
}).then(async r => {
  if (!r.ok) {
    console.log('Request returned status:', r.status);
    return;
  }
  const text = await r.text();
  console.log('Response received, length:', text.length);
}).catch(e => {
  console.error('Fetch error:', e instanceof Error ? e.message : String(e));
});
