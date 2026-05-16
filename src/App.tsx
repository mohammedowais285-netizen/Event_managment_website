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
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mic2,
  Building2,
  Clock
} from 'lucide-react';

// --- Types ---
type View = 'Home' | 'Artists' | 'Venues' | 'Services' | 'Dashboard' | 'CreateEvent' | 'AddArtist' | 'AddVenue';

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
  { id: 'v1', name: 'Delhi', arena: 'Red Fort Arena', concerts: 248, artists: 1024, live: 3, img: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=800&auto=format&fit=crop' },
  { id: 'v2', name: 'Telangana', arena: 'Charminar Stage', concerts: 186, artists: 842, live: 5, img: 'https://images.unsplash.com/photo-1589308078059-be1415e6b219?q=80&w=800&auto=format&fit=crop' },
  { id: 'v3', name: 'Maharashtra', arena: 'Gateway Amphitheater', concerts: 412, artists: 2105, live: 2, img: 'https://images.unsplash.com/photo-1570160897040-30430ade221d?q=80&w=800&auto=format&fit=crop' },
  { id: 'v4', name: 'Rajasthan', arena: 'Hawa Mahal Grounds', concerts: 156, artists: 630, live: 1, img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop' }
];

const INITIAL_EVENTS: Event[] = [
  { id: 'e1', title: 'Midnight Jazz Session', date: 'Oct 12, 2024', artistId: 'a1', venueId: 'v1', label: 'Live Now', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop', price: '$85' },
  { id: 'e2', title: 'Neon Pulse Festival', date: 'Nov 05, 2024', artistId: 'a2', venueId: 'v2', label: 'Selling Fast', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop', price: '$120' },
  { id: 'e3', title: 'Starlight Symphony', date: 'Dec 15, 2024', artistId: 'a3', venueId: 'v3', label: 'Upcoming', img: 'https://images.unsplash.com/photo-1514525253361-bee87187040b?q=80&w=800&auto=format&fit=crop', price: '$150' },
  { id: 'e4', title: 'Rooftop Rock', date: 'Dec 22, 2024', artistId: 'a4', venueId: 'v4', label: 'Upcoming', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop', price: '$65' }
];

// --- Shared Components ---

const Navbar = ({ activeView, setView }: { activeView: View, setView: (v: View) => void }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-white/5 h-20 px-6 md:px-12 flex justify-between items-center bg-slate-950/40 backdrop-blur-2xl">
      <div className="flex items-center gap-10">
        <div 
          onClick={() => setView('Home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 vibrant-gradient rounded-lg shadow-lg shadow-accent/20 transition-transform group-hover:scale-110" />
          <span className="text-2xl font-extrabold tracking-tighter">VIVID<span className="text-accent">EVENTS</span></span>
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
          <button
            onClick={() => setView('Dashboard')}
            className={`text-xs uppercase font-bold tracking-[0.2em] transition-all hover:text-white ${
              ['Dashboard', 'CreateEvent', 'AddArtist', 'AddVenue'].includes(activeView) ? 'text-accent' : 'text-slate-400'
            }`}
          >
            Management
          </button>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all shadow-lg shadow-white/5 active:scale-95">
          Get in Touch
        </button>
      </div>
    </nav>
  );
};

const Sidebar = ({ activeView, setView }: { activeView: View, setView: (v: View) => void }) => {
  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'CreateEvent', icon: PlusCircle, label: 'New Event' },
    { id: 'AddArtist', icon: Mic2, label: 'Add Artist' },
    { id: 'AddVenue', icon: Building2, label: 'Add Venue' },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 fixed left-0 top-20 bottom-0 bg-slate-950/80 backdrop-blur-3xl border-r border-white/5 pt-10 px-6 z-50">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase font-bold text-accent tracking-[0.4em] mb-6">Management Console</h3>
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
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-white/5 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-tight">Admin User</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Premium Account</p>
          </div>
        </div>
        <button className="flex items-center gap-3 text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

// --- View Components ---

const HomeView = ({ setView, events }: { setView: (v: View) => void, events: Event[] }) => {
  return (
    <div className="relative min-h-screen">
      {/* Background Blurs from Design HTML */}
      <div className="absolute -top-24 -left-24 w-96 h-96 vibrant-gradient rounded-full opacity-20 blur-[100px] -z-10"></div>
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-[120px] -z-10"></div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 relative overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
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

      {/* Events Carousel */}
      <section className="py-40 px-6 md:px-12 bg-slate-900/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">Upcoming <br/><span className="serif-ital text-accent">Highlights</span></h2>
              <p className="text-slate-400 text-xl font-medium">Curated world-class events for the next season.</p>
            </div>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-accent border hover:border-accent transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-accent border hover:border-accent transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-20 hide-scrollbar snap-x">
            {events.map((event) => (
              <motion.div 
                key={event.id}
                whileHover={{ y: -15 }}
                className="shrink-0 w-[350px] md:w-[420px] rounded-[44px] glass overflow-hidden snap-center group border border-white/5"
              >
                <div className="h-[360px] relative">
                  <img src={event.img} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-8 left-8">
                    <span className={`px-5 py-2 rounded-full text-[9px] uppercase font-bold tracking-widest backdrop-blur-md border border-white/10 ${
                      event.label === 'Live Now' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-accent/20 text-white'
                    }`}>
                      {event.label === 'Live Now' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2" />}
                      {event.label}
                    </span>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-extrabold mb-2 tracking-tight">{event.title}</h3>
                    <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                       <span>{event.date}</span>
                       <span className="text-white">{event.price}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${event.id}${j}`} alt="Attendee" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-bold">+12</div>
                  </div>
                  <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-accent hover:text-white transition-colors group/btn">
                    Get Access <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer from Design HTML */}
      <footer className="px-12 py-12 flex flex-col md:flex-row justify-between items-center border-t border-white/5 relative z-10 bg-slate-950">
        <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 md:mb-0">
          <span>London</span><span>New York</span><span>Tokyo</span><span>Ibiza</span>
        </div>
        <div className="flex space-x-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Upcoming Highlight</p>
            <p className="text-xs font-bold">NEON GALA 2024 &bull; OCT 12</p>
          </div>
          <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-accent">&rarr;</div>
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
    title: '', date: '', artistId: '', venueId: '', label: 'Upcoming' as any, price: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.artistId || !form.venueId) return;
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
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
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Artist Identity</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Stage Name" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-4">
             <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Genre</label>
             <input required value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} placeholder="e.g. Hyperpop" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
           </div>
           <div className="space-y-4">
             <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Cover Asset (URL)</label>
             <input value={form.img} onChange={e => setForm({...form, img: e.target.value})} placeholder="https://..." className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
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
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Venue Location</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="City/Region" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Arena Title</label>
          <input required value={form.arena} onChange={e => setForm({...form, arena: e.target.value})} placeholder="Specific Landmark / Stage" className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] block ml-4">Heritage Asset (URL)</label>
          <input value={form.img} onChange={e => setForm({...form, img: e.target.value})} placeholder="https://..." className="w-full bg-slate-900/60 border border-white/10 rounded-3xl px-8 py-5 focus:border-accent focus:outline-none transition-all font-bold" />
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

      <Navbar activeView={view} setView={setView} />
      
      <div className="flex">
        {['Dashboard', 'CreateEvent', 'AddArtist', 'AddVenue', 'Settings'].includes(view) && (
          <Sidebar activeView={view} setView={setView} />
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
              {view === 'Home' && <HomeView setView={setView} events={events} />}
              {view === 'Artists' && <ArtistsView artists={artists} />}
              {view === 'Venues' && <VenuesView venues={venues} />}
              {view === 'Services' && <ServicesView />}
              {view === 'Dashboard' && <DashboardView artists={artists} venues={venues} events={events} />}
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
