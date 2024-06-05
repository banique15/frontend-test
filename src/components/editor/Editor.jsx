import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';
import UniqueID from '@tiptap-pro/extension-unique-id';
import MenuBar from './Menubar';
import ColumnExtension from './column-extension/index.ts';
import React, { useState, useEffect } from 'react';
import DraggableItem from './DraggableItem.tsx';

// Extensions for the editor
const extensions = [
  StarterKit.configure({
    autofocus: true,
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  Markdown,
  Youtube,
  UniqueID,
  DraggableItem,
  ColumnExtension,
  Image.configure({
    HTMLAttributes: {
      class: 'editor-image',
    },
  }),
];

export default (props) => {
  const { content: initialContent, onSave } = props;
  const [content, setContent] = useState(initialContent);
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };

  return (
    <div className="bg-white">
      <EditorProvider slotBefore={<MenuBar />} slotAfter={<></>} editor={editor}>
        <div></div>
        <button onClick={handleSave}>Save</button>
      </EditorProvider>
    </div>
  );
};
