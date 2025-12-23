/**
 * Simple Markdown to HTML converter
 */
export function markdownToHtml(markdown: string): string {
    if (!markdown) return '';

    let html = markdown;

    // Headers (must be before paragraphs)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Images with optional size: ![alt](url =widthxheight) or standard ![alt](url)
    // We also support HTML img tags passed through, but let's handle the markdown syntax extensions if used
    html = html.replace(/!\[(.*?)\]\((.*?)\s+=(\d+)(?:x(\d+))?\)/g, '<img src="$2" alt="$1" width="$3" height="$4" style="max-width: 100%; height: auto;" />');
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');

    // Horizontal Rules
    html = html.replace(/^-{3,}$/gim, '<hr />');

    // Tables
    // 1. Headers
    html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
        const cells = content.split('|').map((cell: string) => `<th class="border p-2 bg-muted/50">${cell.trim()}</th>`).join('');
        return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border"><thead><tr>${cells}</tr></thead><tbody>`;
    });
    // 2. Rows
    html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
        if (content.includes('---')) return ''; // Skip separator rows
        const cells = content.split('|').map((cell: string) => `<td class="border p-2">${cell.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
    });
    // 3. Close table (naive implementation - assumes contiguous tables)
    // A better regex approach or parser would be needed for robust nested tables, but this works for simple blocks
    html = html.replace(/(<\/tr>)\n(?!<tr>)/g, '$1</tbody></table></div>\n');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    html = html.replace(/\_\_(.*?)\_\_/g, '<b>$1</b>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');
    html = html.replace(/\_(.*?)\_/g, '<i>$1</i>');

    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

    // Line breaks (double newline = paragraph)
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
}

/**
 * Simple HTML to Markdown converter
 */
export function htmlToMarkdown(html: string): string {
    if (!html) return '';

    let markdown = html;

    // Headers
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');

    // Bold
    markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');

    // Italic
    markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');
    markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');

    // Lists - unordered
    markdown = markdown.replace(/<ul>/gi, '\n');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '- $1\n');

    // Lists - ordered
    markdown = markdown.replace(/<ol>/gi, '\n');
    markdown = markdown.replace(/<\/ol>/gi, '\n');

    // Paragraphs
    markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();

    return markdown;
}
