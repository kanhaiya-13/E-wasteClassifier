import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    console.log('Received classification request');

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert AI system for classifying electronic waste (e-waste). 
Analyze the provided image and identify the type of e-waste shown. Classify it into one of these categories:
- Batteries (rechargeable, alkaline, lithium-ion, etc.)
- Circuit Boards (PCBs, motherboards, electronic components)
- Plastics (casings, cables, housings from electronics)
- Metals (wires, connectors, metal components)
- Displays (screens, monitors, LCD/LED panels)
- Mixed Electronics (devices with multiple materials)

Provide:
1. Primary category
2. Confidence level (0-100%)
3. Specific item identification
4. Material composition
5. Recycling recommendations
6. Environmental hazards if any

Be precise and educational.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'user', 
            content: [
              { type: 'text', text: systemPrompt },
              { 
                type: 'image_url', 
                image_url: { url: image }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_ewaste",
              description: "Classify electronic waste and provide recycling guidance",
              parameters: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    enum: ["Batteries", "Circuit Boards", "Plastics", "Metals", "Displays", "Mixed Electronics"],
                    description: "Primary e-waste category"
                  },
                  confidence: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                    description: "Confidence level in percentage"
                  },
                  item: {
                    type: "string",
                    description: "Specific item identification"
                  },
                  materials: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of materials present"
                  },
                  recycling_guidance: {
                    type: "string",
                    description: "Detailed recycling recommendations"
                  },
                  hazards: {
                    type: "array",
                    items: { type: "string" },
                    description: "Environmental or health hazards if any"
                  },
                  disposal_steps: {
                    type: "array",
                    items: { type: "string" },
                    description: "Step-by-step disposal instructions"
                  }
                },
                required: ["category", "confidence", "item", "materials", "recycling_guidance", "hazards", "disposal_steps"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "classify_ewaste" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service quota exceeded. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No classification result from AI');
    }

    const classification = JSON.parse(toolCall.function.arguments);
    console.log('Classification successful:', classification.category);

    return new Response(
      JSON.stringify({ classification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in classify-ewaste function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Classification failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
