import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const categoryPrompts: Record<string, string> = {
  animals: "cute friendly animal like a puppy, kitten, bunny, or elephant",
  disney: "magical fairy tale character in a whimsical scene",
  superheroes: "heroic superhero character in an action pose",
  videogames: "friendly video game character with fun accessories",
  movies: "popular movie or TV show character in a memorable scene",
  vehicles: "cool vehicle like a car, truck, airplane, or train",
  dinosaurs: "friendly dinosaur like a T-Rex, Triceratops, or Brachiosaurus",
  educational: "educational scene with letters, numbers, or learning elements",
  nature: "beautiful nature scene with flowers, trees, and butterflies",
  books: "character or scene from classic children's literature",
  princesses: "elegant princess in a beautiful castle or garden setting",
  toys: "fun toys like teddy bears, dolls, building blocks, or robots",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { category, customPrompt, ageGroup } = await req.json();

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(
      "Generating coloring page for category:",
      category,
      "age group:",
      ageGroup
    );

    const ageComplexity =
      ageGroup === "kids"
        ? "simple shapes, thick outlines, large areas to color, suitable for children ages 3-8"
        : "intricate details, fine patterns, complex designs suitable for adults and teens";

    const subjectPrompt =
      customPrompt || categoryPrompts[category] || "friendly character";

    const imagePrompt = `Create a black and white line art coloring page illustration of ${subjectPrompt}. 
Style: Clean black outlines on pure white background, no shading or gray tones, no filled areas, 
${ageComplexity}. 
The design should be centered, high contrast, printable quality coloring book style.
No text, no watermarks, no signatures.`;

    console.log("Image prompt:", imagePrompt);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: imagePrompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment and try again." },
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status === 402) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again later." },
          {
            status: 402,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    let publicUrl = imageUrl;

    try {
      const match = imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);

      if (match) {
        const mime = match[1];
        const base64 = match[2];
        const buffer = Buffer.from(base64, "base64");
        const ext = mime.split("/")[1].replace("+xml", "");
        const filename = `${category}/${crypto.randomUUID()}.${ext}`;

        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error: uploadError } = await supabase.storage
          .from("coloring-pages")
          .upload(filename, buffer, {
            contentType: mime,
            upsert: false,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
        } else {
          const { data: pub } = supabase.storage
            .from("coloring-pages")
            .getPublicUrl(filename);

          publicUrl = pub.publicUrl;
        }
      }
    } catch (e) {
      console.error(
        "Failed to upload to storage, falling back to data URL:",
        e
      );
    }

    return NextResponse.json(
      {
        imageUrl: publicUrl,
        category,
        ageGroup,
      },
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating coloring page:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate coloring page",
      },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}