// Editor.jsx
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vsiuakofodgkhmclfvpl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaXVha29mb2Rna2htY2xmdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NTg5OTgsImV4cCI6MjAxNTIzNDk5OH0.ty_9mqxxjK9itXEBCLrFzgtng1tFQGBMRLSwodeGzVk'
);

export default function Editor({ data }) {
  const editorRef = useRef(null);

  console.log('Data:', data.news_content);

  useEffect(() => {
    editorRef.current = new EditorJS({
      holder: 'editorjs',
      data: { blocks: JSON.parse(data.news_content) },
    });

    const updateNews = async (id, title, content) => {
      console.log('Updating news item with id:', id);

      try {
        const { data, error } = await supabase.from('news').update({ news_title: title, news_content: content }).eq('id', id).select();

        if (error) {
          console.error('Error updating news:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.error('No data returned from update function call');
          return;
        }

        console.log('News item updated:', data[0]);
      } catch (error) {
        console.error('Unexpected error in updateNews:', error);
      }
    };

    const saveChanges = async () => {
      if (data && data.id && editorRef.current) {
        const savedData = await editorRef.current.save();
        setSelectedNews({ ...data, news_content: savedData.blocks });
        updateNews(data.id, data.news_title, savedData.blocks);
      }
    };

    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', async () => {
      if (data && data.id) {
        const savedData = await editorRef.current.save();
        updateNews(data.id, data.news_title, savedData.blocks);
      }
    });

    return () => {
      editorRef.current.destroy();
      saveButton.removeEventListener('click');
    };
  }, [data]);

  return <div id="editorjs"></div>;
}
