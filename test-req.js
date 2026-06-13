fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'halo' }] })
}).then(async r => {
  console.log(r.status);
  const text = await r.text();
  console.log(text.slice(0, 100));
}).catch(e => console.error(e));
