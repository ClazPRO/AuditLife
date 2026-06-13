const { streamText } = require('ai');
const { google } = require('@ai-sdk/google');

async function test() {
  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: [{ role: 'user', content: 'test' }]
    });
    console.log(Object.keys(result));
    console.log(typeof result.toDataStreamResponse);
    console.log(typeof result.toTextStreamResponse);
    console.log(typeof result.toAIStreamResponse);
  } catch (e) {
    console.error(e);
  }
}
test();
