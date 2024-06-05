import React from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { FaBold, FaItalic, FaStrikethrough, FaCode, FaEraser, FaParagraph, FaListUl, FaListOl, FaQuoteLeft, FaUndo, FaRedo, FaImage } from 'react-icons/fa';
import { TbPageBreak, TbColumns1, TbColumns2, TbColumns3 } from 'react-icons/tb';
import { MdHorizontalRule } from 'react-icons/md';

// Top Menu Bar for the editor
const MenuBar = () => {
  const { editor } = useCurrentEditor();
  // Check if editor is not null before accessing its storage property
  const markdownOutput = editor ? editor.storage.markdown.getMarkdown() : '';
  console.log(markdownOutput);
  const widthRef = React.useRef(null);
  const heightRef = React.useRef(null);

  React.useEffect(() => {
    if (widthRef.current && heightRef.current) {
      widthRef.current.value = 640;
      heightRef.current.value = 480;
    }
  }, [widthRef.current, heightRef.current]);

  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(widthRef.current.value, 10)) || 640,
        height: Math.max(180, parseInt(heightRef.current.value, 10)) || 480,
      });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <div class="py-1 px-3 bg-white border rounded text-black flex flex-row space-x-6">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          <FaCode />
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <FaEraser />
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>Reset</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
          <FaParagraph />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          H6
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
          <FaListUl />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
          <FaListOl />
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
          <FaCode />
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
          <FaQuoteLeft />
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <MdHorizontalRule />
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          <TbPageBreak />
        </button>
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
          <FaUndo />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
          <FaRedo />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter the image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          <FaImage />
        </button>
        <button onClick={() => editor.chain().focus().unsetColumns().run()}>
          <TbColumns1 />
        </button>
        <button onClick={() => editor.chain().focus().setColumns(2).run()}>
          <TbColumns2 />
        </button>
        <button onClick={() => editor.chain().focus().setColumns(3).run()}>
          <TbColumns3 />
        </button>
      </div>
    </>
  );
};

export default MenuBar;
