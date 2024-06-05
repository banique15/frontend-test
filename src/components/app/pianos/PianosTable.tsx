import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTrail, animated } from '@react-spring/web';
import ProgramInfo from './ProgramInfo';

// Create a single supabase client for interacting with your database
const supabase = createClient(
  'https://vsiuakofodgkhmclfvpl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaXVha29mb2Rna2htY2xmdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NTg5OTgsImV4cCI6MjAxNTIzNDk5OH0.ty_9mqxxjK9itXEBCLrFzgtng1tFQGBMRLSwodeGzVk'
);

function PianoProgramList({ pianoActivations, selectedId, handleClick }) {
  const [error, setError] = useState(null);

  const trail = useTrail(pianoActivations.length, {
    from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      {pianoActivations.length > 0 ? (
        <ul>
          {trail.map((style, index) => (
            <animated.li key={pianoActivations[index].id} style={style}>
              <button
                onClick={() => handleClick(pianoActivations[index])}
                style={selectedId === pianoActivations[index].id ? { backgroundColor: '#F7FAFC' } : {}}
                className="w-full flex flex-grow border bg-white rounded py-1 px-3 mb-1 hover:bg-gray-100"
              >
                {pianoActivations[index].act_title}
              </button>
            </animated.li>
          ))}
        </ul>
      ) : (
        <p>No piano programs found.</p>
      )}
    </div>
  );
}

export function PianoActivationsTable() {
  const [pianoActivations, setPianoActivations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLaunchDate, setEditedLaunchDate] = useState('');
  const [editedApplicationsStartDate, setEditedApplicationsStartDate] = useState(''); // New state variable @banique15 @jessebautista
  const [editedApplicationsEndDate, setEditedApplicationsEndDate] = useState('');
  const [editedAdjudicationStartDate, setEditedAdjudicationStartDate] = useState('');
  const [editedAdjudicationEndDate, setEditedAdjudicationEndDate] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedUrl, setEditedUrl] = useState('');
  const [editedImage, setEditedImage] = useState('');
  const [editedPublicStartDate, setEditedPublicStartDate] = useState('');
  const [editedPublicEndDate, setEditedPublicEndDate] = useState('');




  const handleClick = (pianoActivation) => {
    setSelectedId(pianoActivation.id);
    setEditedTitle(pianoActivation.act_title);
    setEditedLaunchDate(pianoActivation.act_launch_date || '');
    setEditedApplicationsStartDate(pianoActivation.act_applications_start_date || ''); // Set new state variable @banique15 @jessebautista
    setEditedApplicationsEndDate(pianoActivation.act_applications_end_date || ''); // Set new state variable
    setEditedAdjudicationStartDate(pianoActivation.act_adjudication_start_date || ''); 
    setEditedAdjudicationEndDate(pianoActivation.act_adjudication_end_date || '');
    setEditedLocation(pianoActivation.act_location || ''); 
    setEditedUrl(pianoActivation.act_url || '');
    setEditedImage(pianoActivation.act_image || '');
    setEditedPublicStartDate(pianoActivation.act_public_start_date || '');
    setEditedPublicEndDate(pianoActivation.act_public_end_date || '');

 

    localStorage.setItem('selectedActivation', JSON.stringify(pianoActivation.id));
  };

  useEffect(() => {
    console.log('selectedId after setting', selectedId); // Logs the new value
  }, [selectedId]);

  const handleSave = async () => {
    if (selectedId) {
      const { error } = await supabase
        .from('piano_activations')
        .update({
          act_title: editedTitle,
          act_launch_date: editedLaunchDate,
          act_applications_start_date: editedApplicationsStartDate,
          act_applications_end_date: editedApplicationsEndDate, // Include new field in update @banique15 @jessebautista
        })
        .eq('id', selectedId);

      if (error) {
        console.error('Error updating piano program:', error);
      } else {
        const updatedPianoActivations = pianoActivations.map((pianoActivation) =>
          pianoActivation.id === selectedId
            ? {
                ...pianoActivation,
                act_title: editedTitle,
                act_applications_start_date: editedApplicationsStartDate, // Include new field in map @banique15 @jessebautista
                act_launch_date: editedLaunchDate,
                act_applications_end_date: editedApplicationsEndDate,
              }
            : pianoActivation
        );
        setPianoActivations(updatedPianoActivations);
      }
    }
  };

  useEffect(() => {
    const fetchPianoActivations = async () => {
      let { data: pianoActivationsData, error } = await supabase.from('piano_activations').select('*').order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching piano programs:', error);
      } else {
        setPianoActivations(pianoActivationsData);
      }
    };

    fetchPianoActivations();

    const channels = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'piano-activations' }, (payload) => {
        console.log('Change received!', payload);
        fetchPianoActivations(); // Refetch the data whenever a change is detected
      })
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, []);

  return (
    <div className="fixed top-28 left-0 w-full pl-64" style={{ height: 'calc(100vh - 20px)' }}>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg">
        <ResizablePanel defaultSize={25} className="border-0">
          <ScrollArea className="h-full overflow-y-auto rounded-md border p-3">
            <div className="flex h-full w-full p-3 flex-grow">
              <PianoProgramList pianoActivations={pianoActivations} selectedId={selectedId} handleClick={handleClick} />{' '}
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="overflow-visible">
          <div id="piano-program-content" className="flex h-full overflow-y-auto">
            {selectedId && (
              <>
                <div className="bg-white p-6 h-full w-full overflow-y-auto pb-24">
                  <div className="flex flex-col flex-grow gap-4">
                    <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                    <input type="date" value={editedLaunchDate} onChange={(e) => setEditedLaunchDate(e.target.value)} />
                    <input type="date" value={editedApplicationsStartDate} onChange={(e) => setEditedApplicationsStartDate(e.target.value)} />{' '}
                    <input type="date" value={editedApplicationsEndDate} onChange={(e) => setEditedApplicationsEndDate(e.target.value)} /> {/* Add new field input */}
                    {/* Add new field input @banique15 @jessebautista */}
                    <button onClick={handleSave}>Save</button>
                    <ProgramInfo />
                  </div>
                </div>
              </>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default PianoActivationsTable;
