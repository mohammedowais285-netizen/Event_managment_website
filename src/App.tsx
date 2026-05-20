import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  Search, 
  Bell,
  ArrowRight,
  Music,
  Star,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  Zap,
  PartyPopper,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mic2,
  Building2,
  Clock,
  Phone,
  Mail,
  User as UserIcon,
  X,
  Camera,
  Image as ImageIcon,
  Upload,
  Lock
} from 'lucide-react';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  handleFirestoreError, 
  OperationType,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from './lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query, doc, getDoc, setDoc } from 'firebase/firestore';

// --- Types ---
type View = 'Home' | 'Artists' | 'Venues' | 'Services' | 'Dashboard' | 'CreateEvent' | 'AddArtist' | 'AddVenue' | 'Leads';

interface Lead {
  id: string;
  eventName: string;
  email: string;
  phone: string;
  timestamp: any;
}

interface Artist {
  id: string;
  name: string;
  genre: string;
  followers: string;
  status: 'Ongoing' | 'Upcoming';
  tour: string;
  rating: string;
  img: string;
}

interface Venue {
  id: string;
  name: string;
  arena: string;
  concerts: number;
  artists: number;
  live: number;
  img: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  artistId: string;
  venueId: string;
  label: 'Live Now' | 'Selling Fast' | 'Upcoming';
  img: string;
  price: string;
}

// --- Initial Data ---

const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'a1', name: 'Elena Rivers', genre: 'Jazz Singer', followers: '1.2M', status: 'Ongoing', tour: 'Blue Note Tour • NYC', rating: '4.9',
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'a2', name: 'DJ Synthwave', genre: 'Electronic Producer', followers: '2.5M', status: 'Upcoming', tour: 'Neon Dreams Fest • Berlin', rating: '4.8',
    img: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'a3', name: 'Aria Nova', genre: 'Pop Star', followers: '5.8M', status: 'Ongoing', tour: 'Starlight World Tour • London', rating: '5.0',
    img: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'a4', name: 'Leo Vance', genre: 'Indie Rock', followers: '800K', status: 'Upcoming', tour: 'Rooftop Sessions • LA', rating: '4.7',
    img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop'
  }
];

const INITIAL_VENUES: Venue[] = [
  { id: 'v1', name: 'Delhi', arena: 'Red Fort Arena', concerts: 248, artists: 1024, live: 3, img: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=1200' },
  { id: 'v2', name: 'Telangana', arena: 'Charminar Stage', concerts: 186, artists: 842, live: 5, img: 'https://images.unsplash.com/photo-1583533800645-812e9b049755?q=80&w=1200' },
  { id: 'v3', name: 'Maharashtra', arena: 'Gateway Amphitheater', concerts: 412, artists: 2105, live: 2, img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=1200' },
  { id: 'v4', name: 'Rajasthan', arena: 'Hawa Mahal Grounds', concerts: 156, artists: 630, live: 1, img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200' }
];

const INITIAL_EVENTS: Event[] = [
  { id: 'e1', title: 'Midnight Jazz Session', date: 'Oct 12, 2024', artistId: 'a1', venueId: 'v1', label: 'Live Now', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200', price: '$85' },
  { id: 'e2', title: 'Neon Pulse Festival', date: 'Nov 05, 2024', artistId: 'a2', venueId: 'v2', label: 'Selling Fast', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200', price: '$120' },
  { id: 'e3', title: 'Starlight Symphony', date: 'Dec 15, 2024', artistId: 'a3', venueId: 'v3', label: 'Upcoming', img: 'https://images.unsplash.com/photo-1514525253361-bee87187040b?q=80&w=1200', price: '$150' },
  { id: 'e4', title: 'Rooftop Rock', date: 'Dec 22, 2024', artistId: 'a4', venueId: 'v4', label: 'Upcoming', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200', price: '$65' }
];

// --- Shared Components ---

const Navbar = ({ activeView, setView, user, onLogin, onLogout, onGetInTouch }: { 
  activeView: View, 
  setView: (v: View) => void,
  user: FirebaseUser | null,
  onLogin: () => void,
  onLogout: () => void,
  onGetInTouch: () => void
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/5 h-20 px-6 md:px-12 flex justify-between items-center bg-slate-950/40 backdrop-blur-2xl">
      <div className="flex items-center gap-10">
        <div 
          onClick={() => setView('Home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 vibrant-gradient rounded-xl shadow-lg shadow-accent/40 flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 group-hover:rotate-12">
            <Zap className="w-6 h-6 text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter uppercase flex items-center gap-1">
            VIVID<span className="text-accent underline decoration-accent/30 underline-offset-4">EVENTS</span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          {(['Home', 'Artists', 'Venues', 'Services'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v as View)}
              className={`text-xs uppercase font-bold tracking-[0.2em] transition-all hover:text-white ${
                activeView === v ? 'text-accent' : 'text-slate-400'
              }`}
            >
              {v}
            </button>
          ))}
          {user && (
            <button
              onClick={() => setView('Dashboard')}
              className={`text-xs uppercase font-bold tracking-[0.2em] transition-all hover:text-white ${
                ['Dashboard', 'CreateEvent', 'AddArtist', 'AddVenue', 'Leads'].includes(activeView) ? 'text-accent' : 'text-slate-400'
              }`}
            >
              Management
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden sm:block p-2 text-slate-400 hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={onGetInTouch}
          className="px-4 md:px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all shadow-lg shadow-white/5 active:scale-95 whitespace-nowrap"
        >
          Get in Touch
        </button>
        
        {user ? (
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="User" />
            </div>
            <button onClick={onLogout} className="text-slate-400 p-2 hover:text-accent transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-slate-900 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white/5 transition-all shadow-lg active:scale-95"
          >
            <UserIcon className="w-3 h-3" />
            <span className="hidden md:inline">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const Sidebar = ({ activeView, setView, user }: { activeView: View, setView: (v: View) => void, user: FirebaseUser | null }) => {
  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Leads', icon: Bell, label: 'Lead Station' },
    { id: 'CreateEvent', icon: PlusCircle, label: 'Launch Event' },
    { id: 'AddArtist', icon: Mic2, label: 'Add Artist' },
    { id: 'AddVenue', icon: Building2, label: 'Add Venue' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 fixed left-0 top-20 bottom-0 bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 pt-10 px-6 z-50">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase font-bold text-accent tracking-[0.4em] mb-6 px-4">Management Console</h3>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all ${
                activeView === item.id 
                  ? 'vibrant-gradient text-white shadow-lg shadow-accent/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === 'Leads' && (
                <span className="ml-auto w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/5 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
            {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <div className="w-full h-full bg-accent/20" />}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[120px]">{user?.displayName || 'Admin User'}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Premium Account</p>
          </div>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center gap-3 text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

// --- Utils ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const PhotoUploadInput = ({ value, onChange, label }: { value: string, onChange: (v: string) => void, label: string }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // Approx 800KB limit for Firestore data URL strings
        alert("Image too large. Please select a smaller photo (under 800KB).");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        onChange(base64);
      } catch (err) {
        console.error("Error converting file:", err);
      }
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">{label}</label>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-40 h-40 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-white/5 transition-all overflow-hidden relative group shrink-0"
        >
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-600 mb-2 group-hover:text-accent transition-colors" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Select Photo</span>
            </>
          )}
        </div>
        <div className="flex-1 space-y-4 w-full">
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Or provide an Image URL</p>
          <div className="relative">
            <input 
              value={value.startsWith('data:') ? '' : value} 
              onChange={e => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..." 
              className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all font-bold placeholder:text-slate-700 text-xs" 
            />
            <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};

// --- View Components ---

const HomeView = ({ setView, events, user }: { setView: (v: View) => void, events: Event[], user?: any }) => {
  const liveEvents = events.filter(e => e.label === 'Live Now');
  const upcomingEvents = events.filter(e => e.label !== 'Live Now');

  const EventCarousel = ({ title, subtitle, items, accentColor = 'accent' }: { title: string, subtitle: string, items: Event[], accentColor?: string }) => (
    <section className="py-24 px-6 md:px-12 bg-slate-900/10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
              {title.split(' ')[0]} <br/>
              <span className={`serif-ital text-${accentColor}`}>{title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">{subtitle}</p>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-accent border border-white/5 hover:border-accent transition-all group">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-accent border border-white/5 hover:border-accent transition-all group">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-8 overflow-x-auto pb-10 hide-scrollbar snap-x">
          {items.length > 0 ? items.map((event) => (
            <motion.div 
              key={event.id}
              whileHover={{ y: -10 }}
              className="shrink-0 w-[320px] md:w-[400px] rounded-[40px] glass overflow-hidden snap-center group border border-white/5"
            >
              <div className="h-[320px] relative">
                <img src={event.img} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest backdrop-blur-md border border-white/10 ${
                    event.label === 'Live Now' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-accent/20 text-white'
                  }`}>
                    {event.label === 'Live Now' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />}
                    {event.label}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-extrabold mb-1 tracking-tight">{event.title}</h3>
                  <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                     <span>{event.date}</span>
                     <span className="text-white">{event.price}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between bg-white/[0.01]">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="w-7 h-7 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${event.id}${j}`} alt="Attendee" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[8px] font-bold">+12</div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:text-white transition-colors group/btn">
                  {event.label === 'Live Now' ? 'Join Stream' : 'Get Access'} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="w-full py-20 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-[40px]">
              <Clock className="w-8 h-8 mb-4 opacity-20" />
              <p className="text-xs uppercase font-bold tracking-widest">No scheduled events found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="relative min-h-screen">
      <div className="absolute -top-24 -left-24 w-96 h-96 vibrant-gradient rounded-full opacity-20 blur-[100px] -z-10" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-[120px] -z-10" />

      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {user && (
                <div className="mb-6 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 shadow-2xl backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium tracking-wide text-slate-300">
                    Welcome <strong className="font-extrabold text-white text-base">{user.displayName || user.email?.split('@')[0] || 'User'}</strong>
                  </span>
                </div>
              )}
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent mb-4">The Premier Event Collective</h2>
              <h1 className="text-[60px] md:text-[90px] leading-[0.85] font-extrabold tracking-tighter mb-8">
                MAKING<br />
                <span className="serif-ital font-black accent-text">Magic</span><br />
                MANIFEST.
              </h1>
              <p className="text-lg text-slate-400 max-w-md leading-relaxed mb-10">
                From high-octane corporate galas to intimate neon-soaked soirées, we engineer memories that resonate long after the music stops.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setView('Artists')}
                  className="vibrant-gradient px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-lg shadow-accent/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  Explore Our Portfolio
                </button>
                <button className="glass px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white/5 active:scale-95 transition-all">
                  Watch Showreel
                </button>
              </div>
            </motion.div>
          </div>
          
          <div className="hidden lg:grid col-span-5 grid-cols-2 gap-4">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="glass p-6 rounded-3xl neon-border transition-all flex flex-col justify-between h-48"
            >
              <span className="text-3xl font-bold">450+</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Global Events<br/>Delivered</span>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="glass p-6 rounded-3xl border-accent/30 flex flex-col justify-between h-48 mt-8"
            >
              <div className="w-10 h-10 vibrant-gradient rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Elite Tier Venue Access</span>
            </motion.div>
            <div className="col-span-2 glass p-6 rounded-3xl neon-border flex items-center justify-between">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800"></div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-600 text-[10px] flex items-center justify-center font-bold">+12k</div>
              </div>
              <p className="text-xs font-semibold tracking-wider uppercase">Join 12,000+ Attendees this month</p>
            </div>
          </div>
        </div>
      </section>

      <EventCarousel 
        title="Live Performances" 
        subtitle="Experience the energy right now. Secure your last-minute digital pass." 
        items={liveEvents} 
        accentColor="green-400"
      />

      <EventCarousel 
        title="Upcoming Highlights" 
        subtitle="Curated world-class events for the next season. Early birds available." 
        items={upcomingEvents} 
        accentColor="accent"
      />

      <footer className="px-12 py-12 flex flex-col md:flex-row justify-between items-center border-t border-white/5 relative z-10 bg-slate-950">
        <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 md:mb-0">
          <span>London</span><span>New York</span><span>Tokyo</span><span>Ibiza</span>
        </div>
        <div className="flex space-x-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Upcoming Highlight</p>
            <p className="text-xs font-bold">NEON GALA 2024 &bull; OCT 12</p>
          </div>
          <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-accent group cursor-pointer hover:bg-accent hover:text-white transition-all">&rarr;</div>
        </div>
      </footer>
    </div>
  );
};

const ArtistsView = ({ artists }: { artists: Artist[] }) => {
  return (
    <div className="pt-40 pb-40 px-12 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-24">
        <h1 className="text-7xl md:text-[100px] font-extrabold tracking-tighter leading-[0.85] mb-8">
          The <span className="serif-ital text-accent">Collective</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl font-medium">Discover the world's most innovative performers across genres.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {artists.map((artist, i) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col lg:flex-row glass rounded-[40px] overflow-hidden neon-border group h-full"
          >
            <div className="w-full lg:w-1/2 h-80 lg:h-auto overflow-hidden">
              <img src={artist.img} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="p-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-accent text-[9px] uppercase font-bold tracking-[0.3em] mb-2">{artist.genre}</p>
                    <h3 className="text-3xl font-extrabold tracking-tight">{artist.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold">{artist.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-10">
                  <Users className="w-4 h-4" />
                  {artist.followers} GLOBAL REACH
                </div>
              </div>
              <div className="bg-slate-950/60 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                   <div className={`w-2 h-2 rounded-full ${artist.status === 'Ongoing' ? 'bg-green-500 animate-pulse' : 'bg-accent'}`} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">{artist.status}</span>
                </div>
                <p className="text-sm font-semibold tracking-tight text-white/90">{artist.tour}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const VenuesView = ({ venues }: { venues: Venue[] }) => {
  return (
    <div className="pt-40 pb-40 px-12 max-w-7xl mx-auto">
      <header className="mb-24">
        <h1 className="text-7xl md:text-[100px] font-extrabold tracking-tighter leading-[0.85] mb-8">
          The <span className="serif-ital text-accent">Arenas</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl font-medium">Breathtaking locations that command attention and ignite atmosphere.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {venues.map((venue, i) => (
          <motion.div 
            key={venue.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            className="glass rounded-[50px] overflow-hidden group border border-white/10"
          >
            <div className="h-80 relative">
               <img src={venue.img} alt={venue.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors" />
               <div className="absolute top-8 right-8">
                 <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-accent">
                    <MapPin className="w-6 h-6" />
                 </div>
               </div>
               {venue.live > 0 && (
                 <div className="absolute bottom-8 left-8 flex items-center gap-3 glass px-6 py-2.5 rounded-full border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{venue.live} LIVE</span>
                 </div>
               )}
            </div>
            <div className="p-12">
              <h3 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">{venue.name}</h3>
              <p className="text-accent text-[10px] uppercase font-bold tracking-[0.3em] mb-10">{venue.arena}</p>
              
              <div className="grid grid-cols-2 gap-10 py-10 border-t border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Engagements</p>
                  <p className="text-4xl font-extrabold">{venue.concerts}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Performers</p>
                  <p className="text-4xl font-extrabold">{venue.artists}</p>
                </div>
              </div>
              <button className="w-full py-5 rounded-full glass font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                Explore Availability
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ServicesView = () => {
  const packages = [
    {
      title: 'Full Production',
      price: 'Custom',
      icon: Sparkles,
      desc: 'An end-to-end management solution for world tours and massive festivals.',
      features: ['Venue Acquisition & Management', 'Artist Booking & Hospitality', 'Technical AV & Lighting Design', 'Marketing & Global Press Strategy', 'On-site Security & Operations'],
      accent: 'indigo'
    },
    {
      title: 'Experience Design',
      price: 'Starts $5k',
      icon: Music,
      desc: 'Focused on the creative direction and atmosphere of intimate events and soirées.',
      features: ['Immersive Concept Creation', 'Boutique Venue Selection', 'Curated Art & Sound Design', 'Guest List & RSVP Management', 'Post-event Media Package'],
      accent: 'pink'
    },
    {
      title: 'Brand Activation',
      price: 'Custom',
      icon: Zap,
      desc: 'Translating corporate identities into high-octane live musical experiences.',
      features: ['Strategic Brand Positioning', 'Influencer/VIP Integration', 'Interactive Tech Installations', 'Live Stream Production', 'Detailed ROI & Data Analytics'],
      accent: 'purple'
    }
  ];

  return (
    <div className="pt-40 pb-40 px-12 max-w-7xl mx-auto">
      <header className="mb-32 text-center">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[0.6em] text-accent mb-6">Our Expertise</motion.h2>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-7xl md:text-[110px] font-extrabold tracking-tighter leading-[0.85] mb-12"
        >
          MAKING <br/><span className="serif-ital accent-text">The Magic</span>
        </motion.h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
          From full planning to bespoke creative direction, we offer three distinct tiers of service designed to match your vision.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {packages.map((pkg, i) => (
          <motion.div 
            key={pkg.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-12 rounded-[50px] flex flex-col neon-border"
          >
            <div className="w-16 h-16 vibrant-gradient rounded-[20px] flex items-center justify-center mb-10 shadow-lg shadow-accent/20">
              <pkg.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold mb-4 tracking-tight uppercase">{pkg.title}</h3>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">{pkg.desc}</p>
            <div className="text-4xl font-extrabold text-accent mb-10">{pkg.price}</div>
            
            <div className="space-y-4 mb-14 flex-1">
              {pkg.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{f}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-5 rounded-full vibrant-gradient font-bold text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all">
              Consult Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LeadsView = () => {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const leadsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lead[];
        setLeads(leadsData);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="lg:ml-72 pt-32 min-h-screen px-12 pb-40 max-w-7xl mx-auto">
      <header className="mb-20">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tighter">Lead <span className="serif-ital">Station</span></h1>
        <p className="text-slate-400 text-xl font-medium">Capture requests from our most premium partners.</p>
      </header>

      <div className="glass rounded-[44px] overflow-hidden">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/2">
           <h3 className="text-2xl font-extrabold uppercase tracking-tight">Recent Inquiries</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-slate-500 uppercase font-bold tracking-widest">Scanning lead database...</div>
          ) : leads.length === 0 ? (
            <div className="p-20 text-center text-slate-500 uppercase font-bold tracking-widest">No active inquiries found.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40">
                  <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Contact</th>
                  <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Event Vision</th>
                  <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Phone</th>
                  <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-10 py-8">
                       <div className="flex flex-col">
                          <span className="font-bold text-white mb-1">{lead.email}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verified Channel</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 font-black text-accent uppercase tracking-tighter text-lg">{lead.eventName}</td>
                    <td className="px-10 py-8 text-sm font-medium text-slate-300">{lead.phone}</td>
                    <td className="px-10 py-8 text-xs text-slate-500">
                      {lead.timestamp?.toDate ? lead.timestamp.toDate().toLocaleString() : 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const GetInTouchModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [form, setForm] = React.useState({ eventName: '', email: '', phone: '' });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        timestamp: serverTimestamp()
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setForm({ eventName: '', email: '', phone: '' });
      }, 2000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'leads');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass p-10 rounded-[44px] relative border border-white/10"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>

            {status === 'success' ? (
              <div className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-extrabold tracking-tighter">MESSAGE <span className="serif-ital">Manifested</span></h3>
                <p className="text-slate-400">Our team will reach out within 24 operational hours.</p>
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-extrabold tracking-tighter mb-2">Build Your <br /><span className="serif-ital text-accent">Experience</span></h2>
                <p className="text-slate-400 text-sm mb-10 font-medium">Tell us about your event vision.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] ml-4">Event Identity</label>
                    <input 
                      required
                      value={form.eventName}
                      onChange={e => setForm({...form, eventName: e.target.value})}
                      placeholder="e.g. Secret Rooftop Gala" 
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all font-bold placeholder:text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] ml-4">Communication Channel</label>
                    <input 
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="email@example.com" 
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all font-bold placeholder:text-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] ml-4">Secure Line</label>
                    <input 
                      required
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all font-bold placeholder:text-slate-700" 
                    />
                  </div>

                  <button 
                    disabled={status === 'loading'}
                    type="submit" 
                    className="w-full py-5 vibrant-gradient rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-accent/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Transmitting...' : 'Initiate Contact'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SignInModal = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSuccess: (user: any) => void 
}) => {
  const [loading, setLoading] = React.useState(false);
  const [errorText, setErrorText] = React.useState<string | null>(null);
  
  // Custom auth state
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [displayName, setDisplayName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText(null);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (displayName.trim()) {
          await updateProfile(user, { displayName: displayName.trim() });
        }
        onSuccess(user);
        onClose();
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(userCredential.user);
        onClose();
      }
    } catch (err: any) {
      console.error("Email authentication failed:", err);
      let errorMsg = err.message || String(err);
      if (err.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email address is already in use by another account.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid credentials. Please verify your email and password.';
      }
      setErrorText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const u = await signInWithGoogle();
      if (u) {
        onSuccess(u);
        onClose();
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Popup Sign-in caught:", err);
      const message = err.message || String(err);
      if (message.includes('auth/cancelled-popup-request') || message.includes('popup-closed-by-user')) {
        setErrorText("Popup was closed or blocked. Browsers usually block popups within preview iframes by default.");
      } else if (message.includes('auth/unauthorized-domain')) {
        setErrorText("This domain is not authorized in your Firebase Project configuration. Please add the current domain to your Authorized Domains in the Firebase Console.");
      } else {
        setErrorText(`Firebase error: ${message}`);
      }
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    const demoUser = {
      uid: 'demo-admin-session',
      displayName: 'Demo Manager',
      email: 'admin@vivid-events.demo',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
      isDemo: true
    };
    localStorage.setItem('demo_user_session', JSON.stringify(demoUser));
    onSuccess(demoUser);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg glass p-10 rounded-[44px] relative border border-white/10 text-white my-8"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-4xl font-extrabold tracking-tighter leading-tight">Vivid management</h2>
                <p className="serif-ital text-accent text-3xl leading-none mt-1">
                  {mode === 'signin' ? 'Portal Gateway' : 'Identity Registry'}
                </p>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-3">
                  {mode === 'signin' ? 'Unlock administrative performance panels' : 'Create a new manager/editor credential'}
                </p>
              </div>

              {errorText && (
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl text-xs">
                  <p className="text-red-400 font-bold leading-relaxed">{errorText}</p>
                </div>
              )}

              {/* Toggle Tab */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-900/80 rounded-2xl border border-white/5">
                <button 
                  type="button"
                  onClick={() => { setMode('signin'); setErrorText(null); }}
                  className={`py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all ${mode === 'signin' ? 'bg-white text-black shadow-lg shadow-black/25' : 'text-slate-400 hover:text-white'}`}
                >
                  Sign In
                </button>
                <button 
                  type="button"
                  onClick={() => { setMode('signup'); setErrorText(null); }}
                  className={`py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-black shadow-lg shadow-black/25' : 'text-slate-400 hover:text-white'}`}
                >
                  Register
                </button>
              </div>

              {/* Email Credentials Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em] block ml-4">Authorized Name</label>
                    <div className="relative">
                      <input 
                        required
                        type="text"
                        value={displayName} 
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="e.g. John Doe" 
                        className="w-full bg-slate-900/60 border border-white/5 rounded-2xl pl-6 pr-12 py-4 focus:border-accent focus:outline-none transition-all text-xs font-bold" 
                      />
                      <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em] block ml-4">Credential Email</label>
                  <div className="relative">
                    <input 
                      required
                      type="email"
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      placeholder="manager@vivid-events.com" 
                      className="w-full bg-slate-900/60 border border-white/5 rounded-2xl pl-6 pr-12 py-4 focus:border-accent focus:outline-none transition-all text-xs font-bold" 
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em] block ml-4">Access Code Password</label>
                  <div className="relative">
                    <input 
                      required
                      type="password"
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters" 
                      className="w-full bg-slate-900/60 border border-white/5 rounded-2xl pl-6 pr-12 py-4 focus:border-accent focus:outline-none transition-all text-xs font-bold" 
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-4 py-4 vibrant-gradient rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-accent/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 border-0"
                >
                  {loading ? 'Processing Registry...' : mode === 'signin' ? 'Verify Credentials' : 'Create Identity'}
                </button>
              </form>

              {/* Social or Bypass Alternates */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <span className="relative bg-slate-950 px-4 text-[9px] uppercase font-bold tracking-[0.3em] text-slate-600">Alternative portals</span>
                </div>

                <button 
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-0"
                >
                  Sign In with Google
                </button>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                  <span className="relative bg-slate-950 px-4 text-[9px] uppercase font-bold tracking-[0.3em] text-slate-600">Sandbox Override</span>
                </div>

                <div className="space-y-2 text-center">
                  <button 
                    type="button"
                    onClick={handleDemoBypass}
                    className="w-full py-3.5 bg-slate-900 border border-white/10 hover:bg-white/5 text-accent rounded-full font-bold uppercase text-[10px] tracking-[0.3em] active:scale-95 transition-all text-center block"
                  >
                    Bypass via Guest Admin Mode
                  </button>
                  <p className="text-[8px] text-slate-500 font-medium uppercase tracking-[0.15em] leading-normal px-4">
                    Instantly load a local simulated admin session if cookies or popup restrictions block you in the cross-origin iframe.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DashboardView = ({ artists, venues, events }: { artists: Artist[], venues: Venue[], events: Event[] }) => {
  return (
    <div className="lg:ml-72 pt-32 min-h-screen px-12 pb-40 max-w-7xl mx-auto">
      <header className="mb-20">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tighter">Command <span className="serif-ital">Center</span></h1>
        <p className="text-slate-400 text-xl font-medium">Real-time performance analytics and management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Revenue', value: '$240k+', icon: BarChart3 },
          { label: 'Performers', value: artists.length, icon: Mic2 },
          { label: 'Arenas', value: venues.length, icon: Building2 },
          { label: 'Engagements', value: events.length, icon: Calendar },
        ].map((m, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-3xl flex flex-col justify-between"
          >
            <div className="w-10 h-10 vibrant-gradient rounded-xl flex items-center justify-center mb-10 translate-x-1 translate-y-1">
              <m.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-4xl font-extrabold mb-1">{m.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-[44px] overflow-hidden">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/2">
           <h3 className="text-2xl font-extrabold uppercase tracking-tight">Active Portfolios</h3>
           <button className="p-3 glass rounded-xl hover:bg-white/5 transition-colors">
              <Filter className="w-5 h-5 text-accent" />
           </button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-white/5 bg-slate-900/40">
                    <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Asset</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Category</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Metrics</th>
                    <th className="px-10 py-6 text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em]">Staus</th>
                 </tr>
              </thead>
              <tbody>
                 {[...artists.slice(0, 3)].map(a => (
                   <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-10 py-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-accent group-hover:scale-110 transition-all">
                          <img src={a.img} alt={a.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold">{a.name}</span>
                      </td>
                      <td className="px-10 py-6 text-[10px] font-bold uppercase text-slate-400">{a.genre}</td>
                      <td className="px-10 py-6 text-sm font-semibold">{a.followers} Reach</td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${a.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                          {a.status}
                        </span>
                      </td>
                   </tr>
                 ))}
                 {[...venues.slice(0, 2)].map(v => (
                   <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-10 py-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-accent group-hover:scale-110 transition-all">
                          <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold">{v.name}</span>
                      </td>
                      <td className="px-10 py-6 text-[10px] font-bold uppercase text-slate-400">Venue</td>
                      <td className="px-10 py-6 text-sm font-semibold">{v.concerts} Events</td>
                      <td className="px-10 py-6">
                        <span className="px-4 py-1 rounded-full bg-slate-800 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                          Operational
                        </span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

const CreateEventView = ({ artists, venues, onSave }: { artists: Artist[], venues: Venue[], onSave: (e: Event) => void }) => {
  const [form, setForm] = React.useState({
    title: '', date: '', artistId: '', venueId: '', label: 'Upcoming' as any, price: '', img: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.artistId || !form.venueId) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      img: form.img || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
    });
  };

  return (
    <div className="lg:ml-72 pt-32 min-h-screen px-12 pb-40 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="text-6xl font-extrabold tracking-tighter mb-4">Launch <span className="serif-ital">Event</span></h1>
        <p className="text-slate-400 text-xl font-medium">Engineer a new musical milestone.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass p-12 rounded-[50px] space-y-10">
          <PhotoUploadInput 
            label="Event Visual" 
            value={form.img} 
            onChange={v => setForm({...form, img: v})} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Engament Name</label>
              <input 
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                type="text" placeholder="e.g. SOLSTICE FESTIVAL" 
                className="w-full bg-slate-900/60 border border-white/5 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold placeholder:text-slate-700" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Entry Value</label>
              <input 
                required
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                type="text" placeholder="$0.00" 
                className="w-full bg-slate-900/60 border border-white/5 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold placeholder:text-slate-700" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Headliner</label>
              <select 
                required
                value={form.artistId}
                onChange={e => setForm({...form, artistId: e.target.value})}
                className="w-full bg-slate-900/60 border border-white/5 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="">Select Artist...</option>
                {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Strategic Venue</label>
              <select 
                required
                value={form.venueId}
                onChange={e => setForm({...form, venueId: e.target.value})}
                className="w-full bg-slate-900/60 border border-white/5 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="">Select Arena...</option>
                {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Date Portfolio</label>
            <input 
              required
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
              type="date" 
              className="w-full bg-slate-900/60 border border-white/5 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold [color-scheme:dark]" 
            />
          </div>
        </div>

        <button type="submit" className="w-full py-6 vibrant-gradient rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-accent/20 hover:brightness-110 active:scale-95 transition-all">
          Deploy Operation
        </button>
      </form>
    </div>
  );
};

const AddArtistView = ({ onSave }: { onSave: (a: Artist) => void }) => {
  const [form, setForm] = React.useState({ name: '', genre: '', tour: '', img: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      followers: '0',
      status: 'Upcoming',
      rating: '5.0',
      img: form.img || 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?q=80&w=800&auto=format&fit=crop',
      ...form
    });
  };

  return (
    <div className="lg:ml-72 pt-32 min-h-screen px-12 pb-40 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="text-6xl font-extrabold tracking-tighter mb-4">Board <span className="serif-ital">Artist</span></h1>
        <p className="text-slate-400 text-xl font-medium">Add a new performer to the global collective.</p>
      </header>

      <form onSubmit={handleSubmit} className="glass p-12 rounded-[50px] space-y-10">
        <PhotoUploadInput 
          label="Artist Portrait" 
          value={form.img} 
          onChange={v => setForm({...form, img: v})} 
        />
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Artist Identity</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Stage Name" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-4">
             <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Genre</label>
             <input required value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} placeholder="e.g. Hyperpop" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
           </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">First Engagement Title</label>
          <input required value={form.tour} onChange={e => setForm({...form, tour: e.target.value})} placeholder="Tour Name" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
        </div>
        <button type="submit" className="w-full py-6 vibrant-gradient rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-accent/20 active:scale-95 transition-all">
          Register Portfolio
        </button>
      </form>
    </div>
  );
};

const AddVenueView = ({ onSave }: { onSave: (v: Venue) => void }) => {
  const [form, setForm] = React.useState({ name: '', arena: '', img: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      concerts: 0,
      artists: 0,
      live: 0,
      img: form.img || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
      ...form
    });
  };

  return (
    <div className="lg:ml-72 pt-32 min-h-screen px-12 pb-40 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="text-6xl font-extrabold tracking-tighter mb-4">Acquire <span className="serif-ital">Arena</span></h1>
        <p className="text-slate-400 text-xl font-medium">Add a distinctive historical or modern venue.</p>
      </header>

      <form onSubmit={handleSubmit} className="glass p-12 rounded-[50px] space-y-10">
        <PhotoUploadInput 
          label="Venue Exhibition" 
          value={form.img} 
          onChange={v => setForm({...form, img: v})} 
        />
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Venue Location</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="City/Region" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Arena Title</label>
          <input required value={form.arena} onChange={e => setForm({...form, arena: e.target.value})} placeholder="Specific Landmark / Stage" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
        </div>
        <button type="submit" className="w-full py-6 vibrant-gradient rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-accent/20 active:scale-95 transition-all">
          Authorize Venue
        </button>
      </form>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [view, setView] = React.useState<View>('Home');
  const [artists, setArtists] = React.useState<Artist[]>(INITIAL_ARTISTS);
  const [venues, setVenues] = React.useState<Venue[]>(INITIAL_VENUES);
  const [events, setEvents] = React.useState<Event[]>(INITIAL_EVENTS);
  const [user, setUser] = React.useState<any>(() => {
    const stored = localStorage.getItem('demo_user_session');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAdmin, setIsAdmin] = React.useState(() => {
    return localStorage.getItem('demo_user_session') ? true : false;
  });
  const [isGetInTouchOpen, setIsGetInTouchOpen] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = React.useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('demo_user_session');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut failed: ", e);
    }
    setUser(null);
    setIsAdmin(false);
    setView('Home');
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (localStorage.getItem('demo_user_session')) {
        if (u) {
          localStorage.removeItem('demo_user_session');
        } else {
          return;
        }
      }
      setUser(u);
      if (u) {
        const isOwnerEmail = u.email === 'mohammedowais285@gmail.com';
        if (isOwnerEmail) {
          setIsAdmin(true);
        }
        try {
          // Sync user profile
          const userRef = doc(db, 'users', u.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              email: u.email,
              displayName: u.displayName || u.email?.split('@')[0] || 'User',
              isAdmin: isOwnerEmail,
              createdAt: serverTimestamp()
            });
            setIsAdmin(isOwnerEmail);
          } else {
            setIsAdmin(userSnap.data().isAdmin || isOwnerEmail || false);
          }
        } catch (error) {
          console.warn("Firestore user sync failed. Enforcing local user session status.", error);
          setIsAdmin(isOwnerEmail);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen relative selection:bg-accent selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-slate-950" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <Navbar 
        activeView={view} 
        setView={setView} 
        user={user}
        onLogin={() => setIsSignInOpen(true)}
        onLogout={handleLogout}
        onGetInTouch={() => setIsGetInTouchOpen(true)}
      />
      
      <div className="flex">
        {['Dashboard', 'CreateEvent', 'AddArtist', 'AddVenue', 'Leads', 'Settings'].includes(view) && (
          <Sidebar activeView={view} setView={setView} user={user} />
        )}
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {view === 'Home' && <HomeView setView={setView} events={events} user={user} />}
              {view === 'Artists' && <ArtistsView artists={artists} />}
              {view === 'Venues' && <VenuesView venues={venues} />}
              {view === 'Services' && <ServicesView />}
              {view === 'Dashboard' && <DashboardView artists={artists} venues={venues} events={events} />}
              {view === 'Leads' && <LeadsView />}
              {view === 'CreateEvent' && (
                <CreateEventView 
                  artists={artists} 
                  venues={venues} 
                  onSave={(e) => { setEvents([e, ...events]); setView('Home'); }} 
                />
              )}
              {view === 'AddArtist' && (
                <AddArtistView onSave={(a) => { setArtists([a, ...artists]); setView('Artists'); }} />
              )}
              {view === 'AddVenue' && (
                <AddVenueView onSave={(v) => { setVenues([v, ...venues]); setView('Venues'); }} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <GetInTouchModal isOpen={isGetInTouchOpen} onClose={() => setIsGetInTouchOpen(false)} />

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
        onSuccess={(usr) => {
          setUser(usr);
          if (usr.uid === 'demo-admin-session' || usr.email === 'mohammedowais285@gmail.com') {
            setIsAdmin(true);
          }
        }} 
      />

      {/* Floating Status */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="glass px-6 py-4 rounded-2xl flex items-center gap-4 bg-slate-900/60 group"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
            <Music className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Status Update</p>
            <p className="text-xs font-bold text-white/90">Curating the Manifest...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
