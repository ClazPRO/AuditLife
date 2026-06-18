import { google } from "@ai-sdk/google";
import { generateText } from "ai";

async function main() {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Hello",
    });
    console.log("Success length:", text.length);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error calling gemini:", error.message);
    } else {
      console.error("Unknown error occurred");
    }
  }
}

main();
