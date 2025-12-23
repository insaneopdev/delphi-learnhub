import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from './ui/dialog';
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Image as ImageIcon } from 'lucide-react';
import { markdownToHtml } from '@/lib/markdown';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageWidth, setImageWidth] = useState('');
    const [imageHeight, setImageHeight] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const insertHeading = (level: number) => {
        const prefix = '#'.repeat(level) + ' ';
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);

        onChange(newText);
    };

    const insertList = (ordered: boolean) => {
        const prefix = ordered ? '1. ' : '- ';
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);

        onChange(newText);
    };

    const handleInsertImage = () => {
        if (!imageUrl) return;

        const widthAttr = imageWidth ? ` width="${imageWidth}"` : '';
        const heightAttr = imageHeight ? ` height="${imageHeight}"` : '';
        const altAttr = imageAlt ? ` alt="${imageAlt}"` : ' alt=""';

        // We use HTML tag for images to support sizing
        const imgTag = `<img src="${imageUrl}"${altAttr}${widthAttr}${heightAttr} style="max-width: 100%; height: auto;" />`;

        insertMarkdown(imgTag);

        // Reset and close
        setImageUrl('');
        setImageWidth('');
        setImageHeight('');
        setImageAlt('');
        setShowImageDialog(false);
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-muted border-b p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('**', '**')}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdown('*', '*')}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <div className="w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertHeading(1)}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertHeading(2)}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertHeading(3)}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </Button>
                <div className="w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertList(false)}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertList(true)}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <div className="w-px bg-border mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageDialog(true)}
                    title="Insert Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1" />
                <Button
                    type="button"
                    variant={showPreview ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? 'Edit' : 'Preview'}
                </Button>
            </div>

            {/* Editor / Preview */}
            {showPreview ? (
                <div
                    className="p-4 min-h-[200px] prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
                />
            ) : (
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || 'Enter content using Markdown...\n\nExamples:\n**bold** *italic*\n### Heading\n- List item'}
                    className="border-0 min-h-[200px] focus-visible:ring-0 font-mono text-sm"
                />
            )}

            {/* Image Dialog */}
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Image URL or Base64</Label>
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.png"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Alt Text (Description)</Label>
                            <Input
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                placeholder="Description of the image"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Width (optional)</Label>
                                <Input
                                    value={imageWidth}
                                    onChange={(e) => setImageWidth(e.target.value)}
                                    placeholder="e.g. 300 or 50%"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Height (optional)</Label>
                                <Input
                                    value={imageHeight}
                                    onChange={(e) => setImageHeight(e.target.value)}
                                    placeholder="e.g. 200"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowImageDialog(false)}>Cancel</Button>
                        <Button onClick={handleInsertImage}>Insert Image</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
