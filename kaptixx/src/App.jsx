import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Calendar, Star, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import { fetchSchedule, fetchShowDetails } from './api';

const queryClient = new QueryClient();

const ScheduleGrid = () => {
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split('T')[0]
  );

  const { data, isLoading } = useQuery({ 
    queryKey: ['schedule', selectedDate], 
    queryFn: () => fetchSchedule(selectedDate) 
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center text-indigo-500 animate-pulse font-bold tracking-widest">LOADING...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">
            On Air <span className="text-brand text-lg block font-medium lowercase italic">United States • {selectedDate}</span>
          </h1>
        </div>
        
        {/* Functional Date Picker */}
        <div className="relative flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-xl group hover:border-brand transition-colors">
          <Calendar className="text-brand ml-2" size={20} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white outline-none text-sm font-bold uppercase cursor-pointer [color-scheme:dark]"
          />
        </div>
      </header>

      {/* Grid remains the same... */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {data?.length > 0 ? (
          data.map((item) => (
            <Link to={`/show/${item.show.id}`} key={item.id} className="group relative bg-zinc-900 rounded-2xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(99,102,241,0.2)]">
              {/* ... same card content ... */}
              <img src={item.show.image?.medium || 'https://via.placeholder.com/210x295'} alt={item.show.name} className="w-full aspect-[2/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-4">
                <span className="text-[10px] font-bold text-brand uppercase tracking-widest">{item.show.network?.name || 'Streaming'}</span>
                <h3 className="text-white font-bold truncate leading-tight">{item.show.name}</h3>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1"><Clock size={12} /> {item.airtime}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 italic">No programs scheduled for this date.</div>
        )}
      </div>
    </div>
  );
};

const DetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: show, isLoading } = useQuery({ queryKey: ['show', id], queryFn: () => fetchShowDetails(id) });

  if (isLoading) return <div className="h-screen flex items-center justify-center text-indigo-500">FETCHING METADATA...</div>;

  return (
    <div className="min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button onClick={() => navigate(-1)} className="fixed top-8 left-8 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full transition-all">
        <ArrowLeft className="text-white" />
      </button>

      {/* Hero Header */}
      <div className="relative h-[60vh] w-full">
        <img src={show.image?.original} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute bottom-0 w-full max-w-7xl mx-auto px-8 pb-12 flex flex-col md:flex-row gap-10 items-end">
          <img src={show.image?.medium} className="w-56 rounded-2xl shadow-2xl border border-white/10 hidden md:block" alt="" />
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              {show.genres.map(g => <span key={g} className="px-3 py-1 bg-brand/20 border border-brand/30 text-brand text-[10px] font-bold rounded-full uppercase tracking-widest">{g}</span>)}
            </div>
            <h1 className="text-6xl font-black text-white mb-2">{show.name}</h1>
            <div className="flex items-center gap-6 text-gray-300">
              <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star size={18} fill="currentColor"/> {show.rating?.average || 'N/A'}</span>
              <span>{show.premiered?.split('-')[0]}</span>
              <span className="uppercase text-xs tracking-widest bg-zinc-800 px-2 py-1 rounded">{show.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">Summary</h2>
          <div className="text-gray-400 text-lg leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: show.summary }} />
        </div>
        <div className="space-y-8">
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
            <h3 className="text-white font-bold mb-6">Cast Highlights</h3>
            <div className="space-y-6">
              {show._embedded?.cast?.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={c.person.image?.medium} className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                  <div>
                    <p className="text-sm font-bold text-white">{c.person.name}</p>
                    <p className="text-xs text-gray-500">{c.character.name}</p>
                  </div>
                </div>
              ))}
            </div>
            {show.officialSite && (
              <a href={show.officialSite} target="_blank" className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-brand hover:bg-indigo-700 text-white rounded-xl font-bold transition-all">
                <ExternalLink size={18} /> Official Site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<ScheduleGrid />} />
          <Route path="/show/:id" element={<DetailView />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
