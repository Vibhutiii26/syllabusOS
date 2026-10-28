'use client';

import React from 'react';
import { FormulaDisplay } from '@/components/formula-display';

function renderInline(text: string) {
  return text.split(/(\$\$?[\s\S]+?\$\$?|\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) return <FormulaDisplay key={index} className="my-1 block overflow-x-auto font-mono text-center text-base" latex={part.slice(2, -2)} />;
    if (part.startsWith('$') && part.endsWith('$')) return <FormulaDisplay key={index} className="font-mono text-indigo-900" latex={part.slice(1, -1)} />;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="rounded bg-stone-100 px-1 py-0.5 font-mono text-indigo-900">{part.slice(1, -1)}</code>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export function StructuredMarkdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/).filter(Boolean);
  return <div className="space-y-3">{blocks.map((block, index) => {
    const lines = block.split('\n');
    const heading = lines[0].match(/^(#{1,4})\s+(.+)$/);
    if (heading) return <section key={index}><h3 className="mb-1 font-bold text-stone-900">{renderInline(heading[2])}</h3>{lines.slice(1).length > 0 && <p>{renderInline(lines.slice(1).join(' '))}</p>}</section>;
    if (lines.every((line) => /^\s*(?:[-*•]|\d+[.)])\s+/.test(line))) {
      const ordered = /^\s*\d+[.)]/.test(lines[0]);
      const List = ordered ? 'ol' : 'ul';
      return <List key={index} className={`space-y-1 pl-5 ${ordered ? 'list-decimal' : 'list-disc'}`}>{lines.map((line, lineIndex) => <li key={lineIndex}>{renderInline(line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ''))}</li>)}</List>;
    }
    if (block.includes('$$')) return <div key={index}>{renderInline(block)}</div>;
    return <p key={index}>{renderInline(lines.join(' '))}</p>;
  })}</div>;
}
