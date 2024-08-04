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
  const { input, from, to } = await req.json()

  const completion = await openai.chat.completions.create({
    messages:
    [
      {role: "system", "content": `You are a translator. Your translate from ${from} to ${to}. Your output only the translated text`},
      {role: "user", "content": input},

  ],
    model:"gpt-4o-mini",
})
  console.log(completion.choices[0])


  return new Response(JSON.stringify(completion.choices[0].message), { headers: { "Content-Type": "application/json" } },
  )
})

