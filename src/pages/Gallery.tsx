import { Search, MapPin, Filter, ArrowUpDown, MoreHorizontal, Clock, Plus, Image as ImageIcon } from 'lucide-react';
import data from '../data.json';

export default function Gallery() {
  const { gallery } = data;
  const { photos, stats } = gallery;

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-slate-100 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <h1 className="text-lg font-black tracking-tighter text-slate-900 uppercase">Site Gallery</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search photos..." 
                        className="pl-9 pr-4 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-xs w-64 focus:border-primary outline-none transition-all"
                    />
                </div>
                 <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                    <img alt="Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" />
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                    <ImageIcon size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Site B: Grand Central Terminal</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Progress Gallery</h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Visual documentation of site evolution and milestones.</p>
            </div>
            <button className="bg-primary text-white px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider shadow-md hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95 group">
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                Upload Photo
            </button>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-slate-100">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
                <button className="px-4 py-1.5 rounded-md text-xs font-black bg-white text-primary shadow-sm">All</button>
                <button className="px-4 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Foundation</button>
                <button className="px-4 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Finishing</button>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</span>
                <div className="relative">
                    <select className="bg-white border-2 border-slate-200 rounded-lg text-xs font-bold py-1.5 pl-3 pr-8 focus:border-primary outline-none appearance-none cursor-pointer">
                        <option>Newest First</option>
                        <option>Oldest First</option>
                    </select>
                    <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo) => (
                <div key={photo.id} className="break-inside-avoid group cursor-pointer bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-primary transition-all shadow-sm hover:shadow-lg">
                    <div className="relative overflow-hidden">
                        <img 
                            src={photo.url} 
                            alt={photo.title} 
                            className="w-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-navy-dark/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                {photo.category}
                            </span>
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="font-black text-slate-900 text-sm mb-1 leading-tight">{photo.title}</h4>
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mb-3">
                            <Clock size={12} /> {photo.date}
                        </p>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-600 border border-slate-200">
                                    {photo.uploaderInitials}
                                </div>
                                <div className="flex flex-col">
                                     <span className="text-[10px] font-extrabold text-slate-700 uppercase leading-none">{photo.uploader}</span>
                                     <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">{photo.uploaderRole}</span>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-primary transition-colors">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </main>

      {/* Footer - Fixed Bottom */}
      <footer className="fixed bottom-0 left-60 right-0 bg-navy-dark text-white z-[100] border-t-4 border-primary shadow-[0_-10px_30px_rgba(15,23,42,0.3)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Gallery Stats</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black leading-none text-primary">{stats.totalPhotos}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Total Photos</span>
                    </div>
                 </div>
                 <div className="h-8 w-px bg-slate-700"></div>
                 <div className="hidden lg:flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Latest Activity</span>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                            <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-tight">Today: {stats.newUploads} New</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                            <Clock size={12} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-tight">Latest: 42m ago</span>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Update Timestamp</span>
                 <div className="flex items-center gap-6">
                    <span className="text-3xl font-black tracking-tighter text-white font-mono">{stats.lastUpdate}</span>
                    <button className="bg-primary/10 border-2 border-primary text-primary px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2">
                         <Filter size={16} /> {/* Using Filter icon as share generic for now per lucide avail */}
                         Share Gallery
                    </button>
                 </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
