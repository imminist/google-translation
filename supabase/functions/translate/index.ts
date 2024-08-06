import { corsHeaders } from '../_shared/cors.ts'
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import OpenAI from 'npm:openai'

const openai = new OpenAI()
console.log("==================================")
console.log("Hello from Functions!")
console.log("==================================")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders})
  }
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


  return new Response(JSON.stringify(completion.choices[0].message), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200, },
  )
})

