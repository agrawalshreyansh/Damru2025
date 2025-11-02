// app/api/autocomplete/route.js (App Router - Using Places API New)

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      {
        message:
          "Server configuration error: Google Places API Key is missing.",
      },
      { status: 500 }
    );
  }

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { message: "Invalid or missing search query." },
      { status: 400 }
    );
  }

  try {
    const GOOGLE_API_URL =
      "https://places.googleapis.com/v1/places:autocomplete";

    const requestBody = {
      input: q,
      // CORRECT parameter name for Places API (New)
      includedPrimaryTypes: ["locality"],
      // Optional: Restrict to specific countries
      // includedRegionCodes: ["IN"],
      languageCode: "en",
    };

    const response = await fetch(GOOGLE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "Google Places API Error:",
        response.status,
        response.statusText,
        errorData
      );

      return NextResponse.json(
        {
          message: `Failed to fetch data from Google Places API. Status: ${response.status}`,
          error: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
