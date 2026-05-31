"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
	value: string;
	onChange: (html: string) => void;
	placeholder?: string;
	className?: string;
}

export function RichTextEditor({
	value,
	onChange,
	placeholder,
	className,
}: RichTextEditorProps) {
	const [isPreview, setIsPreview] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [2, 3] },
			}),
		],
		content: value || "",
		editorProps: {
			attributes: {
				class: "prose prose-sm max-w-none focus:outline-none min-h-[12rem] p-4",
			},
		},
		onUpdate: ({ editor: e }) => {
			onChange(e.getHTML());
		},
	});

	// Sync external value changes (e.g. when narrative loads from server)
	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value || "");
		}
	}, [value, editor]);

	// Toggle editable state
	useEffect(() => {
		if (editor) {
			editor.setEditable(!isPreview);
		}
	}, [isPreview, editor]);

	if (!editor) {
		return <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />;
	}

	return (
		<div className={className}>
			{/* Toolbar */}
			<div className="flex items-center gap-1 px-3 py-2 border border-gray-200 border-b-0 rounded-t-lg bg-gray-50">
				<ToolbarButton
					onClick={() => setIsPreview(!isPreview)}
					active={isPreview}
					title={isPreview ? "Switch to edit mode" : "Switch to preview mode"}
				>
					{isPreview ? "✏️ Edit" : "👁️ Preview"}
				</ToolbarButton>

				{!isPreview && (
					<>
						<div className="w-px h-5 bg-gray-300 mx-1" />
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBold().run()}
							active={editor.isActive("bold")}
							title="Bold"
						>
							<strong>B</strong>
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleItalic().run()}
							active={editor.isActive("italic")}
							title="Italic"
						>
							<em>I</em>
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleStrike().run()}
							active={editor.isActive("strike")}
							title="Strikethrough"
						>
							<s>S</s>
						</ToolbarButton>
						<div className="w-px h-5 bg-gray-300 mx-1" />
						<ToolbarButton
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}
							active={editor.isActive("heading", { level: 2 })}
							title="Heading 2"
						>
							H2
						</ToolbarButton>
						<ToolbarButton
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 3 }).run()
							}
							active={editor.isActive("heading", { level: 3 })}
							title="Heading 3"
						>
							H3
						</ToolbarButton>
						<div className="w-px h-5 bg-gray-300 mx-1" />
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							active={editor.isActive("bulletList")}
							title="Bullet List"
						>
							• List
						</ToolbarButton>
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							active={editor.isActive("orderedList")}
							title="Numbered List"
						>
							1. List
						</ToolbarButton>
						<div className="w-px h-5 bg-gray-300 mx-1" />
						<ToolbarButton
							onClick={() => editor.chain().focus().toggleBlockquote().run()}
							active={editor.isActive("blockquote")}
							title="Quote"
						>
							❝
						</ToolbarButton>
					</>
				)}
			</div>

			{/* Editor */}
			<div
				className={`border border-gray-200 border-t-0 rounded-b-lg ${
					isPreview ? "bg-gray-50" : ""
				}`}
			>
				<EditorContent editor={editor} placeholder={placeholder} />
			</div>
		</div>
	);
}

function ToolbarButton({
	onClick,
	active,
	title,
	children,
}: {
	onClick: () => void;
	active: boolean;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			className={`px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
				active ? "bg-gray-200 text-gray-900" : "text-gray-600"
			}`}
		>
			{children}
		</button>
	);
}
