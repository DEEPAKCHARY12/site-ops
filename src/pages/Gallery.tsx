import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, ArrowUpDown, MoreHorizontal, Clock, Plus, ImageIcon, Loader2, Link } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/gallery';

export default function Gallery() {
    const [photos, setPhotos] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalPhotos: 0, newUploads: 0, lastUpdate: '--:--' });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filters, setFilters] = useState({ search: '', phase: 'All', sortBy: 'newest' });
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareLink, setShareLink] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchGallery = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.phase !== 'All') params.append('site_phase', filters.phase);
            params.append('sort_by', filters.sortBy);

            const res = await axios.get(`${API_BASE}?${params.toString()}`);
            setPhotos(res.data.items);
            setStats(res.data.stats);
        } catch (err) {
            console.error("Error fetching gallery:", err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchGallery();
        }, 300); // Debounce search/filters
        return () => clearTimeout(timer);
    }, [fetchGallery]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.split('.')[0] || 'Untitled');
        formData.append('site_phase', filters.phase === 'All' ? 'General' : filters.phase);
        formData.append('photo_category', 'Site Update');
        formData.append('uploader_name', 'Admin User');
        formData.append('uploader_role', 'Project Manager');

        try {
            await axios.post(`${API_BASE}/upload`, formData);
            alert("Photo uploaded successfully!");
            fetchGallery();
        } catch (err: any) {
            alert(err.response?.data?.detail || "Upload failed.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleShare = async () => {
        try {
            const res = await axios.post(`${API_BASE}/share`);
            setShareLink(res.data.link);
            setIsShareModalOpen(true);
        } catch (err) {
            alert("Failed to generate share link.");
        }
    };

    const formatTimestamp = (ts: string) => {
        const date = new Date(ts);
        return `Uploaded: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="flex flex-col min-h-screen pb-20">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/jpeg,image/png,image/gif,image/tiff"
            />

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
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="pl-9 pr-4 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-xs w-64 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                            <img alt="Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 transition-opacity duration-300" style={{ opacity: loading ? 0.6 : 1 }}>

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
                    <button 
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className="bg-primary text-white px-5 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider shadow-md hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95 group disabled:opacity-70"
                    >
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} className="group-hover:rotate-90 transition-transform" />}
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-slate-100">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
                        {['All', 'Foundation', 'Finishing'].map((phase) => (
                            <button 
                                key={phase}
                                onClick={() => setFilters({ ...filters, phase })}
                                className={`px-4 py-1.5 rounded-md text-xs font-black transition-all ${filters.phase === phase ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {phase}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</span>
                        <div className="relative">
                            <select 
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="bg-white border-2 border-slate-200 rounded-lg text-xs font-bold py-1.5 pl-3 pr-8 focus:border-primary outline-none appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                            <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Masonry Grid */}
                {loading && photos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Gallery...</span>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <ImageIcon size={64} className="text-slate-200 mb-4" />
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Photos Found</h3>
                        <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or upload a new photo.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {photos.map((photo: any) => (
                            <div key={photo.id} className="break-inside-avoid group cursor-pointer bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-primary transition-all shadow-sm hover:shadow-lg">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={photo.photo_url.startsWith('/') ? `http://localhost:8000${photo.photo_url}` : photo.photo_url}
                                        alt={photo.title}
                                        className="w-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 bg-navy-dark/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                            {photo.site_phase}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-black text-slate-900 text-sm mb-1 leading-tight">{photo.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mb-1">
                                        <Clock size={12} /> {photo.photo_category}
                                    </p>
                                    <div className="text-[10px] text-slate-400 font-bold bg-slate-50 p-2 rounded-lg mb-3 border border-slate-100">
                                        {formatTimestamp(photo.upload_timestamp)}
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-600 border border-slate-200">
                                                {photo.uploader_name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-extrabold text-slate-700 uppercase leading-none">{photo.uploader_name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">{photo.uploader_role}</span>
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
                )}

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
                                    <span className="text-[10px] font-black uppercase tracking-tight">Latest: {stats.lastUpdate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Site Document Refresh</span>
                        <div className="flex items-center gap-6">
                            <span className="text-3xl font-black tracking-tighter text-white font-mono">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                            <button 
                                onClick={handleShare}
                                className="bg-primary/10 border-2 border-primary text-primary px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Filter size={16} />
                                Share Gallery
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-2xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Link className="text-primary" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-navy-dark tracking-tight uppercase mb-2">Share Gallery Link</h3>
                            <p className="text-slate-500 text-sm font-medium mb-6">
                                A temporary, secure link has been generated for external review.
                            </p>
                            <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-100 mb-8 font-mono text-xs text-slate-600 break-all">
                                {shareLink}
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareLink);
                                        alert("Link copied to clipboard!");
                                    }}
                                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
                                >
                                    Copy Link
                                </button>
                                <button 
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="px-4 py-3 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
