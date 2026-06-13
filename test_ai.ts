import { google } from "@ai-sdk/google";
import { generateText } from "ai";

async function main() {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Hello",
    });
    console.log("Success:", text);
  } catch (error: any) {
    console.error("Error calling gemini:", error?.message || error);
  }
}

main();
