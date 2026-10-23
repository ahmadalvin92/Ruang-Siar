import React from 'react';

interface FormattedArticleProps {
  content: string;
  className?: string;
}

interface ASTNode {
  type: 'text' | 'bold' | 'italic' | 'underline' | 'strike';
  text?: string;
  children?: ASTNode[];
}

/**
 * Safely parses markdown & HTML inline formatting tags:
 * - Bold: **text**, <b>text</b>, <strong>text</strong>
 * - Italic: *text*, <i>text</i>, <em>text</em>
 * - Underline: <u>text</u>, <ins>text</ins>
 * - Strike: ~~text~~, <s>text</s>, <del>text</del>
 * Recursively supports nested formatting (e.g. bold underline).
 */
export function parseFormattedNodes(text: string): ASTNode[] {
  if (!text) return [];

  // Match inline tokens in order of specificity
  const tokenRegex =
    /(\*\*[^*]+\*\*|<b>[\s\S]*?<\/b>|<strong>[\s\S]*?<\/strong>|\*[^*]+\*|<i>[\s\S]*?<\/i>|<em>[\s\S]*?<\/em>|<u>[\s\S]*?<\/u>|<ins>[\s\S]*?<\/ins>|~~[^~]+~~|<s>[\s\S]*?<\/s>|<del>[\s\S]*?<\/del>)/gi;

  const parts = text.split(tokenRegex);
  const result: ASTNode[] = [];

  for (const part of parts) {
    if (!part) continue;

    let match: RegExpMatchArray | null = null;

    if (
      (match = part.match(/^\*\*([^*]+)\*\*$/)) ||
      (match = part.match(/^<b>([\s\S]*?)<\/b>$/i)) ||
      (match = part.match(/^<strong>([\s\S]*?)<\/strong>$/i))
    ) {
      result.push({ type: 'bold', children: parseFormattedNodes(match[1]) });
    } else if (
      (match = part.match(/^\*([^*]+)\*$/)) ||
      (match = part.match(/^<i>([\s\S]*?)<\/i>$/i)) ||
      (match = part.match(/^<em>([\s\S]*?)<\/em>$/i))
    ) {
      result.push({ type: 'italic', children: parseFormattedNodes(match[1]) });
    } else if (
      (match = part.match(/^<u>([\s\S]*?)<\/u>$/i)) ||
      (match = part.match(/^<ins>([\s\S]*?)<\/ins>$/i))
    ) {
      result.push({ type: 'underline', children: parseFormattedNodes(match[1]) });
    } else if (
      (match = part.match(/^~~([^~]+)~~$/)) ||
      (match = part.match(/^<s>([\s\S]*?)<\/s>$/i)) ||
      (match = part.match(/^<del>([\s\S]*?)<\/del>$/i))
    ) {
      result.push({ type: 'strike', children: parseFormattedNodes(match[1]) });
    } else {
      result.push({ type: 'text', text: part });
    }
  }

  return result;
}

/**
 * Renders AST nodes to safe React elements.
 */
function renderNodes(nodes: ASTNode[], keyPrefix = 'node'): React.ReactNode {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;

    switch (node.type) {
      case 'bold':
        return (
          <strong key={key} className="font-bold text-white">
            {node.children ? renderNodes(node.children, key) : null}
          </strong>
        );
      case 'italic':
        return (
          <em key={key} className="italic text-slate-200">
            {node.children ? renderNodes(node.children, key) : null}
          </em>
        );
      case 'underline':
        return (
          <u
            key={key}
            className="underline decoration-amber-500/70 underline-offset-4 decoration-2 text-slate-200 font-medium"
          >
            {node.children ? renderNodes(node.children, key) : null}
          </u>
        );
      case 'strike':
        return (
          <s key={key} className="line-through text-slate-400">
            {node.children ? renderNodes(node.children, key) : null}
          </s>
        );
      case 'text':
      default:
        // Handle inner newlines within a paragraph if any
        if (node.text && node.text.includes('\n')) {
          const lines = node.text.split('\n');
          return (
            <React.Fragment key={key}>
              {lines.map((line, lineIdx) => (
                <React.Fragment key={`${key}-ln-${lineIdx}`}>
                  {lineIdx > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }
        return <React.Fragment key={key}>{node.text}</React.Fragment>;
    }
  });
}

export default function FormattedArticle({
  content,
  className = 'space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg',
}: FormattedArticleProps) {
  if (!content) return null;

  // Split into paragraphs by double newlines or multiple newlines
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, idx) => {
        const nodes = parseFormattedNodes(paragraph);
        return (
          <p key={idx} className="leading-relaxed">
            {renderNodes(nodes, `p-${idx}`)}
          </p>
        );
      })}
    </div>
  );
}
