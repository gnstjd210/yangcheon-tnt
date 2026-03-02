"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            TextStyle,
            Color,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'rich-text-content focus:outline-none min-h-[300px] p-6 text-gray-700 bg-white leading-relaxed',
            },
        },
    });

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return <div className="min-h-[350px] border border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">에디터 로딩중...</div>;
    }

    const setHeader = (level: 1 | 2 | 3) => {
        editor.chain().focus().toggleHeading({ level }).run();
    };

    const setColor = (e: React.FormEvent<HTMLInputElement>) => {
        editor.chain().focus().setColor((e.target as HTMLInputElement).value).run();
    };

    return (
        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2 shrink-0">
                {/* Headers */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
                    <button
                        type="button"
                        onClick={() => setHeader(1)}
                        className={`px-2 py-1.5 rounded-md text-sm font-bold transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => setHeader(2)}
                        className={`px-2 py-1.5 rounded-md text-sm font-bold transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => setHeader(3)}
                        className={`px-2 py-1.5 rounded-md text-sm font-bold transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        H3
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className={`px-2 py-1.5 rounded-md text-sm transition-colors ${editor.isActive('paragraph') ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        P
                    </button>
                </div>

                {/* Styling */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="굵게"
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="기울임"
                    >
                        <Italic size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('underline') ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="밑줄"
                    >
                        <UnderlineIcon size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('strike') ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="취소선"
                    >
                        <Strikethrough size={18} />
                    </button>
                </div>

                {/* Color */}
                <div className="flex items-center gap-2 border-r border-gray-300 pr-3 mr-1">
                    <label htmlFor="color-picker" className="text-sm font-medium text-gray-600 ml-1">색상:</label>
                    <input
                        id="color-picker"
                        type="color"
                        onInput={setColor}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                    />
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="왼쪽 정렬"
                    >
                        <AlignLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="가운데 정렬"
                    >
                        <AlignCenter size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="오른쪽 정렬"
                    >
                        <AlignRight size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="양쪽 정렬"
                    >
                        <AlignJustify size={18} />
                    </button>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="기호 목록"
                    >
                        <List size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-1.5 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-200'}`}
                        title="번호 목록"
                    >
                        <ListOrdered size={18} />
                    </button>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className={`flex-1 overflow-y-auto cursor-text ${placeholder && editor.isEmpty ? 'relative before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before:pointer-events-none before:top-4 before:left-4' : ''}`}
                onClick={() => editor.commands.focus()}
                data-placeholder={placeholder}
            >
                <EditorContent editor={editor} className="min-h-full" />
            </div>

            <style jsx global>{`
                .ProseMirror {
                    flex-grow: 1;
                    outline: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
