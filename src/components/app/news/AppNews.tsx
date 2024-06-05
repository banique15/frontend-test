import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTrail, animated } from '@react-spring/web';
import EditorJS from '@editorjs/editorjs';
import Header from 'editorjs-header-with-alignment';
import editorjsColumns from '@calumk/editorjs-columns';
import ImageTool from '@editorjs/image';

const supabase = createClient(
  'https://vsiuakofodgkhmclfvpl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaXVha29mb2Rna2htY2xmdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NTg5OTgsImV4cCI6MjAxNTIzNDk5OH0.ty_9mqxxjK9itXEBCLrFzgtng1tFQGBMRLSwodeGzVk'
);

function NewsList({ setSelectedNews, news }) {
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const trail = useTrail(news.length, {
    from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
  });

  const handleClick = (newsItem) => {
    setSelectedNews(newsItem);
    setSelectedId(newsItem.id);
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className=" w-full">
      {news.length > 0 ? (
        <ul className="text-left">
          {trail.map((style, index) => (
            <animated.li key={news[index].id} style={style}>
              <button
                onClick={() => handleClick(news[index])}
                style={selectedId === news[index].id ? { backgroundColor: '#F7FAFC' } : {}}
                className="w-full text-left flex flex-grow border bg-white rounded py-1 px-3 mb-1 hover:bg-gray-100"
              >
                {news[index].news_title}
              </button>
            </animated.li>
          ))}
        </ul>
      ) : (
        <p>No news found.</p>
      )}
    </div>
  );
}

export function AppShell() {
  const [selectedNews, setSelectedNews] = useState(null);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      let { data: newsData, error } = await supabase.from('news').select('*').range(0, 25).order('news_date', { ascending: false });

      if (error) setError(error);
      else setNews(newsData);
    };

    fetchNews();

    const channels = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, (payload) => {
        console.log('Change received!', payload);
      })
      .subscribe();
  }, []);

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

      // Update the selected news item
      setSelectedNews(data[0]);

      // Update the news list
      setNews((prevNews) => prevNews.map((item) => (item.id === id ? data[0] : item)));
    } catch (error) {
      console.error('Unexpected error in updateNews:', error);
    }
  };

  const handleTitleChange = (event) => {
    setSelectedNews({ ...selectedNews, news_title: event.target.value });
  };

  const editorRef = useRef<EditorJS | null>(null);

  useLayoutEffect(() => {
    // first define the tools to be made avaliable in the columns
    let column_tools = {
      header: Header,
    };

    let main_tools = {
      // Load Official Tools
      header: Header,
      image: {
        class: ImageTool,
        config: {
          uploader: {
            /**
             * Upload file to the server and return an uploaded image data
             * @param {File} file - file selected from the device or pasted by drag-n-drop
             * @return {Promise.<{success, file: {url}}>}
             */
            uploadByFile: async (file) => {
              const filePath = `uploads/${file.name}`;
              let { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);

              if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return {
                  success: 0,
                };
              }

              let { data: urlData, error: urlError } = await supabase.storage.from('uploads').getPublicUrl(filePath);

              if (urlError) {
                console.error('Error getting image URL:', urlError);
                return {
                  success: 0,
                };
              }

              console.log('Uploaded file URL:', urlData.publicUrl); // Log the publicUrl

              return {
                success: 1,
                file: {
                  url: urlData.publicUrl, // Corrected property name
                },
              };
            },
          },
        },
      },
      columns: {
        class: editorjsColumns,
        config: {
          EditorJsLibrary: EditorJS, // Pass the library instance to the columns instance.
          tools: column_tools, // IMPORTANT! ref the column_tools
        },
      },
    };

    editorRef.current = new EditorJS({
      holder: 'editorjs',
      autofocus: true,
      data: {},
      tools: main_tools,
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // Run this effect only once when the component mounts

  useEffect(() => {
    if (selectedNews && editorRef.current) {
      editorRef.current.isReady
        .then(() => {
          editorRef.current
            ?.clear()
            .then(() => {
              // If news_content is null, render a blank paragraph block
              if (selectedNews.news_content === null) {
                editorRef.current?.render({
                  blocks: [{ type: 'paragraph', data: { text: '' } }],
                });
                return;
              }

              let content;
              try {
                content = Array.isArray(selectedNews.news_content) ? selectedNews.news_content : JSON.parse(selectedNews.news_content);
              } catch (error) {
                console.error('Error parsing news_content:', error);
                // Handle the error appropriately here
                return;
              }
              editorRef.current?.render({ blocks: content });
            })
            .catch((e) => console.error('Editor.js render error', e));
        })
        .catch((e) => console.error('Editor.js is not ready:', e));
    }
  }, [selectedNews]); // Run this effect whenever selectedNews changes

  const saveChanges = async () => {
    if (selectedNews && editorRef.current) {
      const newContent = await editorRef.current.save();
      setSelectedNews({ ...selectedNews, news_content: newContent.blocks });
      updateNews(selectedNews.id, selectedNews.news_title, newContent.blocks);
    }
  };

  return (
    <div className="fixed top-32 left-0 w-full pl-64" style={{ height: 'calc(100vh - 20px)' }}>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg">
        <ResizablePanel defaultSize={25} className="border-0">
          <ScrollArea className="h-full overflow-y-auto rounded-md border p-3">
            <div className="flex h-full w-full p-3 flex-grow">
              <NewsList setSelectedNews={setSelectedNews} news={news} />
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="">
          <ScrollArea className="h-full overflow-y-auto rounded-md border p-3">
            <div id="news-content" className="flex flex-col p-6 ">
              <div className="">
                {selectedNews && (
                  <div>
                    <input type="text" value={selectedNews.news_title} onChange={handleTitleChange} />

                    <button onClick={saveChanges}>Save</button>
                  </div>
                )}
              </div>
              <div className="mockup-browser border bg-white overflow-visible z-50">
                <div className="mockup-browser-toolbar">
                  <div className="input bg-gray-400">{selectedNews && selectedNews.news_url}</div>
                </div>
                <div className="flex flex-col justify-center p-12 bg-white overflow-visible">
                  <img className="rounded-lg m-6" src={selectedNews && selectedNews.news_image} alt="" />
                  <h1 className="text-3xl m-6 text-black font-bold">{selectedNews && selectedNews.news_title}</h1>
                  <div className="overflow-visible" id="editorjs">
                    {isLoading && <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default AppShell;
