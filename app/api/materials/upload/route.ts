import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/server/auth';
import { PDFParse } from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const authResult = await getAuth();
    if (!authResult.ok) {
      return authResult.response;
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subjectId = (formData.get('subjectId') as string) || 'btech-eng-phys-waves';

    if (!file) {
      return NextResponse.json(
        { error: 'no_file', message: 'Please select a PDF or document file to upload.' },
        { status: 400 }
      );
    }

    // Limit size to 20 MB
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'file_too_large', message: 'File exceeds maximum limit of 20MB.' },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = '';
    let pageCount = 1;
    let isScanned = false;

    if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      try {
        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        const parsed = await parser.getText();
        extractedText = parsed.text || '';
        pageCount = parsed.total || 1;
        await parser.destroy();
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        return NextResponse.json(
          {
            error: 'pdf_parse_failed',
            message: 'Could not extract text from this PDF file. The file may be corrupt or encrypted.'
          },
          { status: 422 }
        );
      }
    } else {
      // Plain text, markdown, syllabus outline
      extractedText = buffer.toString('utf-8');
      pageCount = Math.max(1, Math.ceil(extractedText.length / 2500));
    }

    // Clean whitespace
    const cleanText = extractedText.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();

    if (cleanText.length < 50) {
      isScanned = true;
    }

    // Split into meaningful sections based on common headings or paragraph breaks
    const rawSections = cleanText
      .split(/\n\s*(?:Unit|Chapter|Section|\d+\.|\bMODULE\b|\bPART\b)/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 40);

    const sections = (rawSections.length > 0 ? rawSections : [cleanText.slice(0, 3000)])
      .slice(0, 10)
      .map((content, idx) => ({
        id: `sec-${idx + 1}`,
        heading: `Section ${idx + 1}`,
        preview: content.slice(0, 200) + '...',
        content: content.slice(0, 4000)
      }));

    const documentRecord = {
      id: `doc-${Date.now()}`,
      userId: authResult.ctx.userId,
      subjectId,
      fileName: file.name,
      fileSize: file.size,
      pageCount,
      wordCount: cleanText.split(/\s+/).filter(Boolean).length,
      uploadedAt: new Date().toISOString(),
      isScanned,
      status: isScanned ? 'needs_ocr' : 'processed',
      message: isScanned
        ? 'Notice: This document appears to be a scanned image with minimal selectable text. OCR is recommended.'
        : 'Text extracted and sectioned successfully.',
      sections
    };

    return NextResponse.json({
      success: true,
      document: documentRecord
    });
  } catch (error: any) {
    console.error('Error in /api/materials/upload:', error);
    return NextResponse.json(
      { error: 'upload_failed', message: error?.message || 'Server error while processing uploaded material.' },
      { status: 500 }
    );
  }
}
