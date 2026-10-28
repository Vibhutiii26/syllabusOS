import { NextRequest, NextResponse } from 'next/server';
import { TutorRequestSchema } from '@/lib/schemas';
import { generateTutorResponse } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parseResult = TutorRequestSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid tutor request parameters',
          details: parseResult.error.flatten()
        },
        { status: 400 }
      );
    }

    const tutorResponse = await generateTutorResponse(parseResult.data);
    return NextResponse.json(tutorResponse);
  } catch (error: any) {
    console.error('Error handling tutor request in /api/tutor:', error);
    return NextResponse.json(
      {
        error: 'An internal error occurred while generating tutor response',
        message: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
