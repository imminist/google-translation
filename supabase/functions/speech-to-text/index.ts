import { corsHeaders } from '../_shared/cors.ts'
import OpenAI, {toFile } from 'npm:openai';

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const openai = new OpenAI()

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders})
  }


  const { audioBase64 } = await req.json()
  const audioBuffer = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))
  const file = await toFile(audioBuffer, 'audio.m4a', {
    type: 'm4a'
  })


  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return new Response(
    JSON.stringify(transcription),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  )
})

