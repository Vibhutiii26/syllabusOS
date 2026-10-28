'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
  Presentation,
  BookOpen,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  FileUp
} from 'lucide-react';

export interface UploadedDoc {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  wordCount: number;
  uploadedAt: string;
  isScanned: boolean;
  status: string;
  message: string;
  sections: {
    id: string;
    heading: string;
    preview: string;
    content: string;
  }[];
}

interface MaterialsUploaderProps {
  onOpenDocumentSummary: (doc: UploadedDoc) => void;
  onGenerateNotesFromDoc: (doc: UploadedDoc) => void;
  onGenerateQuizFromDoc: (doc: UploadedDoc) => void;
  onGeneratePptxFromDoc: (doc: UploadedDoc) => void;
  onAskTutorWithDoc: (doc: UploadedDoc) => void;
}

const STORAGE_DOCS_KEY = 'syllabus_os_uploaded_docs_v1';

export function MaterialsUploader({
  onOpenDocumentSummary,
  onGenerateNotesFromDoc,
  onGenerateQuizFromDoc,
  onGeneratePptxFromDoc,
  onAskTutorWithDoc
}: MaterialsUploaderProps) {
  const [documents, setDocuments] = useState<UploadedDoc[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_DOCS_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved docs:', e);
      }
    }
    return [
      {
        id: 'doc-sample-1',
        fileName: 'BTech_Physics_Unit1_Lecture_Notes.pdf',
        fileSize: 1482000,
        pageCount: 12,
        wordCount: 3840,
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
        isScanned: false,
        status: 'processed',
        message: 'Text extracted and sectioned successfully.',
        sections: [
          {
            id: 'sec-1',
            heading: 'Section 1: Wave Fundamentals & Phase Shifts',
            preview: 'Harmonic oscillations in elastic media. Particles oscillate with amplitude A while energy propagates...',
            content: 'Harmonic oscillations in elastic media. Particles oscillate with amplitude A while energy propagates at wave velocity v = f * lambda. Instantaneous phase phi = kx - omega*t + phi_0 defines the state of vibration.'
          },
          {
            id: 'sec-2',
            heading: 'Section 2: Superposition and YDSE Geometry',
            preview: 'When two coherent monochromatic beams meet, resultant amplitude R = sqrt(A1^2 + A2^2 + 2A1A2 cos delta_phi)...',
            content: 'When two coherent monochromatic beams meet, resultant amplitude R = sqrt(A1^2 + A2^2 + 2A1A2 cos delta_phi). In Young double slit apparatus, path difference delta_x = d * y / D. Bright fringes occur at y_n = n * lambda * D / d.'
          }
        ]
      }
    ];
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activePreviewDoc, setActivePreviewDoc] = useState<UploadedDoc | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveDocs = (newDocs: UploadedDoc[]) => {
    setDocuments(newDocs);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(newDocs));
      } catch (e) {
        console.error('Failed to persist docs:', e);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File is larger than 20MB. Please upload a smaller document.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', 'btech-eng-phys-waves');

    try {
      setUploadProgress(50);
      const res = await fetch('/api/materials/upload', {
        method: 'POST',
        body: formData
      });

      setUploadProgress(85);

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Upload failed');
      }

      const data = await res.json();
      setUploadProgress(100);

      const newDoc: UploadedDoc = data.document;
      saveDocs([newDoc, ...documents]);
    } catch (err: any) {
      console.error('File upload failed:', err);
      setUploadError(err.message || 'Failed to process document.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDelete = (id: string) => {
    saveDocs(documents.filter((d) => d.id !== id));
    if (activePreviewDoc?.id === id) setActivePreviewDoc(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            SyllabusOS Documents
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            My Materials &amp; Lecture Notes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Upload your syllabus PDF or professor&apos;s lecture notes to generate tailored lessons, PPTs, and practice.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition flex items-center gap-2 shadow-sm"
        >
          <FileUp className="w-4 h-4 text-indigo-300" />
          Upload New Document
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          accept=".pdf,.txt,.md"
          className="hidden"
        />
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileUpload(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 sm:p-12 rounded-[32px] border-2 border-dashed border-stone-300 hover:border-indigo-400 bg-stone-50/70 hover:bg-indigo-50/20 transition cursor-pointer text-center space-y-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-900">
            Drag and drop your syllabus or lecture notes PDF here
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Supports PDF, TXT, Markdown notes up to 20MB. Text is parsed and split into structured modules automatically.
          </p>
        </div>

        {isUploading && (
          <div className="max-w-xs mx-auto space-y-2 pt-2">
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-indigo-700">
              Extracting text and sectioning modules... {uploadProgress}%
            </span>
          </div>
        )}

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 max-w-md mx-auto flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#e7e2d6] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Uploaded Documents ({documents.length})
          </h3>
          <span className="text-xs text-stone-400 font-medium">Ready for AI learning</span>
        </div>

        {documents.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-stone-400">
            <BookOpen className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs font-medium">No documents uploaded yet.</p>
            <p className="text-[11px]">Upload your course syllabus or lecture slides to generate tailored quizzes and PPTs.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-indigo-300 transition space-y-4"
              >
                {/* Doc Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900">{doc.fileName}</h4>
                        {doc.isScanned ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Needs OCR
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Processed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {Math.round(doc.fileSize / 1024)} KB • {doc.pageCount} Pages • {doc.wordCount.toLocaleString()} Words • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setActivePreviewDoc(activePreviewDoc?.id === doc.id ? null : doc)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {activePreviewDoc?.id === doc.id ? 'Hide' : 'Inspect'}
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scanned Warning if any */}
                {doc.isScanned && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{doc.message}</span>
                  </div>
                )}

                {/* Action Chips for this document */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/60">
                  <button
                    onClick={() => onGeneratePptxFromDoc(doc)}
                    className="px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Presentation className="w-3.5 h-3.5 text-blue-300" />
                    Generate PPT (.pptx)
                  </button>

                  <button
                    onClick={() => onGenerateNotesFromDoc(doc)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Revision Notes
                  </button>

                  <button
                    onClick={() => onGenerateQuizFromDoc(doc)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Create Quiz
                  </button>

                  <button
                    onClick={() => onAskTutorWithDoc(doc)}
                    className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Ask Grounded Q&amp;A
                  </button>
                </div>

                {/* Sections Preview Drawer */}
                {activePreviewDoc?.id === doc.id && (
                  <div className="pt-3 border-t border-stone-200 space-y-2 animate-fade-in">
                    <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Extracted Text Sections ({doc.sections.length})
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {doc.sections.map((sec) => (
                        <div key={sec.id} className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                          <span className="font-bold text-stone-900 block">{sec.heading}</span>
                          <p className="text-stone-500 text-[11px] leading-relaxed line-clamp-3">{sec.preview}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
