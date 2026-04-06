import Link from "next/link";
import type { ReactNode } from "react";

type PMNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};

function isPmNode(x: unknown): x is PMNode {
  return x !== null && typeof x === "object";
}

function renderText(text: string, marks: PMNode["marks"], key: string): ReactNode {
  let el: ReactNode = text;
  if (!marks?.length) return <span key={key}>{el}</span>;
  for (let i = marks.length - 1; i >= 0; i--) {
    const m = marks[i]!;
    switch (m.type) {
      case "bold":
        el = <strong key={`${key}-b${i}`}>{el}</strong>;
        break;
      case "italic":
        el = <em key={`${key}-i${i}`}>{el}</em>;
        break;
      case "underline":
        el = (
          <span key={`${key}-u${i}`} className="underline">
            {el}
          </span>
        );
        break;
      case "strike":
        el = <s key={`${key}-s${i}`}>{el}</s>;
        break;
      case "code":
        el = (
          <code
            key={`${key}-c${i}`}
            className="rounded bg-parchment px-1 py-0.5 text-sm font-mono"
          >
            {el}
          </code>
        );
        break;
      case "link": {
        const href = String(m.attrs?.href ?? "#");
        const internal = href.startsWith("/");
        el = internal ? (
          <Link
            key={`${key}-l${i}`}
            href={href}
            className="text-sage underline-offset-2 hover:underline"
          >
            {el}
          </Link>
        ) : (
          <a
            key={`${key}-l${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sage underline-offset-2 hover:underline"
          >
            {el}
          </a>
        );
        break;
      }
      default:
        break;
    }
  }
  return <span key={key}>{el}</span>;
}

function renderNode(node: unknown, index: number): ReactNode {
  if (!isPmNode(node)) return null;
  const key = `n-${index}-${node.type ?? "x"}`;

  if (node.type === "text" && node.text !== undefined) {
    return renderText(node.text, node.marks, key);
  }

  const children = node.content?.map((c, i) => renderNode(c, i)) ?? [];

  switch (node.type) {
    case "doc":
      return (
        <div key={key} className="space-y-4">
          {children}
        </div>
      );
    case "paragraph":
      return (
        <p key={key} className="text-stone leading-relaxed">
          {children.length ? children : "\u00a0"}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const cls =
        "font-serif text-ink mt-8 mb-3 text-xl sm:text-2xl scroll-mt-24";
      if (level <= 1) {
        return (
          <h1 key={key} className={cls}>
            {children}
          </h1>
        );
      }
      if (level === 2) {
        return (
          <h2 key={key} className={cls}>
            {children}
          </h2>
        );
      }
      return (
        <h3 key={key} className={cls}>
          {children}
        </h3>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="list-disc space-y-2 pl-6 text-stone">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal space-y-2 pl-6 text-stone">
          {children}
        </ol>
      );
    case "listItem":
      return (
        <li key={key} className="leading-relaxed">
          {children}
        </li>
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-sage pl-4 my-6 italic text-stone"
        >
          {children}
        </blockquote>
      );
    case "horizontalRule":
      return <hr key={key} className="my-8 border-border-light" />;
    case "hardBreak":
      return <br key={key} />;
    case "codeBlock": {
      const text = flattenText(node);
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-lg bg-ink/5 p-4 text-sm font-mono my-6"
        >
          <code>{text}</code>
        </pre>
      );
    }
    default:
      return children.length ? (
        <div key={key} className="my-2">
          {children}
        </div>
      ) : null;
  }
}

function flattenText(node: PMNode): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map((c) => (isPmNode(c) ? flattenText(c) : "")).join("");
}

/** Renders a TipTap / ProseMirror JSON `doc` from Convex `posts.content`. */
export function TipTapRenderer({ content }: { content: unknown }) {
  if (!isPmNode(content) || content.type !== "doc") {
    return (
      <p className="text-stone italic">
        This article has no formatted body yet. Check back soon.
      </p>
    );
  }

  return (
    <div id="narrative" className="max-w-reading mx-auto">
      <div className="prose prose-base sm:prose-lg prose-stone max-w-none">
        {renderNode(content, 0)}
      </div>
    </div>
  );
}
