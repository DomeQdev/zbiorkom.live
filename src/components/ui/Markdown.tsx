import { Box, Typography } from "@mui/material";
import { Fragment, ReactNode, useMemo } from "react";

type Marks = {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    href?: string;
};

type Span = { text: string; marks: Marks };
type Block = { spans: Span[]; heading: boolean; marker?: string; indent: number };

// emphasis never wraps whitespace, and a lone _ never splits a word, or snake_case_names turn italic
const INLINE_RULES: { pattern: RegExp; marks: Marks; lead?: boolean }[] = [
    { pattern: /\*\*([\s\S]+?)\*\*/, marks: { bold: true } },
    { pattern: /__([\s\S]+?)__/, marks: { bold: true } },
    { pattern: /~~([\s\S]+?)~~/, marks: { strike: true } },
    { pattern: /<u>([\s\S]+?)<\/u>/, marks: { underline: true } },
    { pattern: /\*([^\s*][^*\n]*[^\s*]|[^\s*])\*/, marks: { italic: true } },
    { pattern: /(^|[^\w_])_([^\s_][^_\n]*[^\s_]|[^\s_])_(?![\w_])/, marks: { italic: true }, lead: true },
    { pattern: /`([^`\n]+)`/, marks: {} },
];

const LINK_RE = /\[([^\]]*)\]\(\s*([^)\s]*)[^)]*\)/;
const HEADING_RE = /^\s{0,3}#{1,6}\s+/;
const RULE_RE = /^\s{0,3}([-*_])\s*(?:\1\s*){2,}$/;
const QUOTE_RE = /^\s{0,3}>\s?/;
const ITEM_RE = /^(\s*)(?:[-*+]|(\d+)[.)])\s+/;
const SAFE_HREF_RE = /^(https?:|mailto:|tel:)/i;

const parseInline = (text: string, marks: Marks): Span[] => {
    let hit: { index: number; length: number; content: string; marks: Marks } | undefined;

    for (const rule of INLINE_RULES) {
        const match = rule.pattern.exec(text);
        if (!match) continue;

        const lead = rule.lead ? match[1].length : 0;
        const index = match.index + lead;
        if (hit && index >= hit.index) continue;

        hit = {
            index,
            length: match[0].length - lead,
            content: rule.lead ? match[2] : match[1],
            marks: rule.marks,
        };
    }

    const link = LINK_RE.exec(text);
    if (link && (!hit || link.index < hit.index)) {
        hit = { index: link.index, length: link[0].length, content: link[1], marks: { href: link[2] } };
    }

    if (!hit) return text.length > 0 ? [{ text, marks }] : [];

    return [
        ...parseInline(text.slice(0, hit.index), marks),
        ...parseInline(hit.content, { ...marks, ...hit.marks }),
        ...parseInline(text.slice(hit.index + hit.length), marks),
    ];
};

const parseBlocks = (markdown: string): Block[] => {
    const blocks: Block[] = [];
    let paragraph: string[] = [];

    const flush = () => {
        if (paragraph.length === 0) return;

        blocks.push({ spans: parseInline(paragraph.join("\n"), {}), heading: false, indent: 0 });
        paragraph = [];
    };

    for (const rawLine of markdown.split("\n")) {
        const line = rawLine.replace(QUOTE_RE, "").replace(/\s+$/, "");
        if (line.length === 0 || RULE_RE.test(line)) {
            flush();
            continue;
        }

        const heading = HEADING_RE.exec(line);
        if (heading) {
            flush();
            blocks.push({ spans: parseInline(line.slice(heading[0].length), {}), heading: true, indent: 0 });
            continue;
        }

        const item = ITEM_RE.exec(line);
        if (item) {
            flush();
            blocks.push({
                spans: parseInline(line.slice(item[0].length), {}),
                heading: false,
                marker: item[2] ? `${item[2]}.` : "•",
                indent: Math.floor(item[1].length / 2),
            });
            continue;
        }

        paragraph.push(line.trimStart());
    }

    flush();

    return blocks;
};

const renderSpan = ({ text, marks }: Span, index: number): ReactNode => {
    let node: ReactNode = text;

    if (marks.bold) node = <b>{node}</b>;
    if (marks.italic) node = <i>{node}</i>;
    if (marks.underline) node = <u>{node}</u>;
    if (marks.strike) node = <s>{node}</s>;

    // alert text comes from operators' feeds, so only plain web links become clickable
    if (marks.href !== undefined && SAFE_HREF_RE.test(marks.href)) {
        node = (
            <a href={marks.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                {node}
            </a>
        );
    }

    return <Fragment key={index}>{node}</Fragment>;
};

export default ({ content }: { content: string }) => {
    const blocks = useMemo(() => parseBlocks(content), [content]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {blocks.map((block, index) => (
                <Box key={index} sx={{ display: "flex", gap: 0.75, paddingLeft: `${block.indent * 16}px` }}>
                    {block.marker !== undefined && (
                        <Typography variant="body2" sx={{ minWidth: 14 }}>
                            {block.marker}
                        </Typography>
                    )}

                    <Typography
                        variant={block.heading ? "subtitle2" : "body2"}
                        sx={{ flex: 1, whiteSpace: "pre-line", overflowWrap: "anywhere" }}
                    >
                        {block.spans.map(renderSpan)}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};
