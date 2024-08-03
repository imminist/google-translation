// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import OpenAI from 'npm:openai'

const openai = new OpenAI()
console.log("==================================")
console.log("Hello from Functions!")
console.log("==================================")

Deno.serve(async (req) => {
  const { name } = await req.json()

  const completion = await openai.chat.completions.create({
    messages:
    [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Who won the world series in 2020?"},
      {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
      {"role": "user", "content": "Where was it played?"}
  ],
    model:"gpt-4o-mini",
})
  console.log(completion.choices[0])


  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } },
  )
})

