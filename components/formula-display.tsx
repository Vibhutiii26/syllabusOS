'use client';

import React from 'react';

const greek: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', theta: 'θ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ',
  tau: 'τ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', Gamma: 'Γ', Delta: 'Δ',
  Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Omega: 'Ω'
};
const sub: Record<string, string> = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','=':'₌','(':'₍',')':'₎','a':'ₐ','e':'ₑ','i':'ᵢ','j':'ⱼ','k':'ₖ','n':'ₙ','r':'ᵣ','x':'ₓ' };
const sup: Record<string, string> = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾','n':'ⁿ','i':'ⁱ' };

function convertScript(value: string, table: Record<string, string>) {
  return [...value].map((char) => table[char] ?? char).join('');
}

function formatTex(source: string): string {
  let value = source.replace(/\\(?:left|right|displaystyle|quad|qquad|,|;|!|:|\\)/g, ' ');
  for (let i = 0; i < 6; i += 1) {
    const next = value
      .replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)⁄($2)')
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)')
      .replace(/\\(?:text|mathrm|operatorname)\s*\{([^{}]*)\}/g, '$1');
    if (next === value) break;
    value = next;
  }
  value = value.replace(/\\([A-Za-z]+)/g, (token, name: string) => {
    const operators: Record<string, string> = {
      cdot: '·', times: '×', pm: '±', mp: '∓', approx: '≈', neq: '≠',
      leq: '≤', geq: '≥', in: '∈', to: '→', rightarrow: '→', infinity: '∞',
      sin: 'sin', cos: 'cos', tan: 'tan', ln: 'ln', log: 'log'
    };
    return greek[name] ?? operators[name] ?? token;
  });
  value = value.replace(/\^\{([^{}]*)\}|\^([\w+\-=()])/g, (_, grouped: string | undefined, single: string | undefined) => convertScript(grouped ?? single ?? '', sup));
  value = value.replace(/_\{([^{}]*)\}|_([\w+\-=()])/g, (_, grouped: string | undefined, single: string | undefined) => convertScript(grouped ?? single ?? '', sub));
  return value.replace(/[{}]/g, '').replace(/\\/g, '').replace(/\s+/g, ' ').trim();
}

export function FormulaDisplay({ latex, className = '' }: { latex: string; className?: string }) {
  return <span className={className} aria-label={`Formula: ${latex}`}>{formatTex(latex)}</span>;
}
