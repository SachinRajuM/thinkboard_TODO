import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';
const Homepage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes,setNotes] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes"); 
        console.log('Response data:', res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
          console.log(error);
          if (error.response?.status === 429) {
            setIsRateLimited(true);
            toast.error("Rate limit exceeded. Please try again later.");
          } else if (error.response.status >= 500) {
            toast.error("Server error. Please try again later.");
          } else {
            toast.error(`Failed to load notes: ${error.response.data?.message || 'Unknown error'}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          toast.error("No response from server. Is the backend running?");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          toast.error(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  },[])
  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}
        
        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div>
                <NoteCard key={note._id} note={note} setNotes={setNotes}/>
              </div>
            ))}
          </div> 
        )}
      </div>
    </div>
  )
}

export default Homepage;