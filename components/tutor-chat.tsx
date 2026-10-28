'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { LearnerState, ChatMessage } from '@/types/learning';
import { TutorResponse } from '@/lib/schemas';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  BookOpen,
  Lightbulb,
  Calculator,
  Compass,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface TutorChatProps {
  learnerState: LearnerState;
  activeUnitId?: string;
  initialConceptId?: string;
  initialPrompt?: string;
  initialMode?: string;
  onOpenLesson: (conceptId: string) => void;
}

const STORAGE_CHAT_KEY = 'syllabus_os_chat_messages_v1';

export function TutorChat({
  learnerState,
  activeUnitId,
  initialConceptId,
  initialPrompt,
  initialMode,
  onOpenLesson
}: TutorChatProps) {
  const [activeConceptId, setActiveConceptId] = useState(
    initialConceptId || learnerState.activeConceptId || SAMPLE_CURRICULUM.concepts[0].id
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_CHAT_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse chat messages:', e);
      }
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `👋 **Welcome to SyllabusOS AI Teacher!**\n\nI am your dedicated university professor for **B.Tech Engineering Physics (Waves & Wave Optics)**.\n\nWhether you missed a lecture, don't have college notes, or want an intuitive explanation with formulas, I'm here to help. Pick any concept above or choose a suggested question below to begin!`,
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConcept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === activeConceptId);
  const mastery = activeConcept ? learnerState.mastery[activeConcept.id] : null;

  // Persist messages to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle triggered prompts from lesson view
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt, initialMode || 'general_question');
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend: string, mode: string = 'general_question') => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      conceptId: activeConceptId,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const recentHistory = messages.slice(-6).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId: activeConceptId,
          prompt: textToSend,
          mode,
          learnerContext: {
            status: mastery?.status || 'not_assessed',
            evidenceScore: mastery?.evidenceScore || 0
          },
          conversationHistory: recentHistory
        })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data: TutorResponse = await res.json();

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        conceptId: activeConceptId,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Tutor chat request failed:', err);
      // Graceful fallback response
      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: activeConcept
          ? `### 📘 ${activeConcept.title} (Syllabus Reference)\n\n${activeConcept.shortSummary}\n\n**Intuitive Analogy:**\n${activeConcept.storyAnalogy.analogy}\n\n**Key Formula:**\n${activeConcept.formula ? activeConcept.formula.latex : 'N/A'}\n\n*Note: Running in offline syllabus grounding mode.*`
          : `I am currently offline, but you can explore the syllabus concepts and interactive diagrams directly from the sidebar.`,
        conceptId: activeConceptId,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const welcome: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `Chat history cleared. How can I assist you with **${activeConcept?.title || 'Waves and Optics'}** today?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcome]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-[32px] border border-[#e7e2d6] shadow-xs flex flex-col h-[780px] max-w-4xl mx-auto overflow-hidden">
      {/* Top Header & Topic Switcher */}
      <div className="bg-[#faf7f0] px-6 py-4 border-b border-[#e7e2d6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">SyllabusOS AI Teacher</h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Grounded in {SAMPLE_CURRICULUM.subjectCode}: {SAMPLE_CURRICULUM.subjectName}
            </p>
          </div>
        </div>

        {/* Concept Selector Pill */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-600">Active Topic:</label>
          <select
            value={activeConceptId}
            onChange={(e) => setActiveConceptId(e.target.value)}
            className="bg-white border border-stone-300 text-xs font-semibold text-stone-800 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SAMPLE_CURRICULUM.concepts.filter((c) => !activeUnitId || c.unitId === activeUnitId).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleClearHistory}
            title="Reset Conversation"
            className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="bg-stone-50/80 px-6 py-2.5 border-b border-stone-200/60 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-stone-400 font-medium whitespace-nowrap text-[11px]">Quick Prompts:</span>
        <button
          onClick={() => handleSendMessage(`Explain ${activeConcept?.title} using an intuitive real-world analogy.`, 'analogy_story')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition text-[11px] font-medium flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          Everyday Analogy
        </button>
        <button
          onClick={() => handleSendMessage(`Walk me through the mathematical derivation of ${activeConcept?.title}.`, 'deep_derivation')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition text-[11px] font-medium flex items-center gap-1.5"
        >
          <Calculator className="w-3 h-3 text-emerald-500" />
          Formula Derivation
        </button>
        <button
          onClick={() => handleSendMessage(`What are the key prerequisites I need to understand ${activeConcept?.title}?`, 'troubleshoot_prerequisite')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition text-[11px] font-medium flex items-center gap-1.5"
        >
          <Compass className="w-3 h-3 text-blue-500" />
          Prerequisite Breakdown
        </button>
      </div>

      {/* Chat Messages Scrollable Feed */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-50/30">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-stone-900 text-white'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`group relative max-w-[85%] rounded-[24px] p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-tr-sm'
                    : 'bg-white border border-[#e7e2d6] text-stone-800 shadow-xs rounded-tl-sm'
                }`}
              >
                {/* Content */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {/* Footer timestamp & copy */}
                <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-stone-400">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-stone-500 hover:text-stone-800 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-[#e7e2d6] p-4 rounded-[24px] rounded-tl-sm text-xs text-stone-500 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              Thinking and grounding in B.Tech physics curriculum...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-[#e7e2d6]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${activeConcept?.title || 'wave optics'} (e.g., "Why does intensity quadruple in constructive interference?")...`}
            className="flex-1 bg-stone-100 border border-stone-200/80 rounded-full px-5 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 disabled:opacity-40 transition shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
