import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BarChart3,
  BedDouble,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Compass,
  DoorOpen,
  Heart,
  LayoutDashboard,
  MapPin,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Utensils,
  UserRound,
  Users,
  WalletCards,
  WashingMachine,
  Wifi,
  Wrench,
  X,
} from 'lucide-react';
import './styles.css';
import { getHotels, login, register } from './api';

const hotels = [
  {
    id: 1,
    name: 'Casa Morena',
    place: 'Oaxaca, Mexico',
    type: 'Boutique stay',
    price: 184,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85',
    tags: ['Rooftop pool', 'Breakfast included'],
    tint: 'terracotta',
  },
  {
    id: 2,
    name: 'The Juniper House',
    place: 'Kyoto, Japan',
    type: 'Design hotel',
    price: 242,
    rating: 4.8,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=85',
    tags: ['Garden view', 'Quiet district'],
    tint: 'olive',
  },
  {
    id: 3,
    name: 'Asteria Lodge',
    place: 'Amalfi, Italy',
    type: 'Cliffside retreat',
    price: 315,
    rating: 4.7,
    reviews: 63,
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=900&q=85',
    tags: ['Sea view', 'Private terrace'],
    tint: 'blue',
  },
  {
    id: 4,
    name: 'Moss & Stone',
    place: 'Lisbon, Portugal',
    type: 'City hideaway',
    price: 156,
    rating: 4.6,
    reviews: 97,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=85',
    tags: ['Workspace', 'Local neighborhood'],
    tint: 'gold',
  },
  {
    id: 5,
    name: 'Tide & Timber',
    place: 'Bali, Indonesia',
    type: 'Island retreat',
    price: 128,
    rating: 4.8,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=900&q=85',
    tags: ['Infinity pool', 'Yoga deck'],
    tint: 'teal',
  },
  {
    id: 6,
    name: 'The Cape House',
    place: 'Cape Town, South Africa',
    type: 'Coastal guesthouse',
    price: 198,
    rating: 4.7,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=85',
    tags: ['Mountain view', 'Airport transfer'],
    tint: 'blue',
  },
  {
    id: 7,
    name: 'Casa Lumen',
    place: 'Barcelona, Spain',
    type: 'Urban boutique',
    price: 171,
    rating: 4.6,
    reviews: 109,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85',
    tags: ['City center', 'Rooftop lounge'],
    tint: 'gold',
  },
];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Explore stays', icon: Compass },
  { label: 'My bookings', icon: CalendarDays, count: 2 },
  { label: 'Saved places', icon: Heart },
];

function App() {
  const [activeNav, setActiveNav] = useState('Sign in');
  const [destination, setDestination] = useState('Anywhere');
  const [dates, setDates] = useState('Jun 14 - 18, 2024');
  const [guests, setGuests] = useState('2 guests');
  const [writeYourOwnGuestCount, setWriteYourOwnGuestCount] = useState('5');
  const [budget, setBudget] = useState(260);
  const [saved, setSaved] = useState([2]);
  const [showAll, setShowAll] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [toast, setToast] = useState('');
  const [hotelData, setHotelData] = useState(hotels);
  const [searchResults, setSearchResults] = useState(hotels);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [view, setView] = useState('auth');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: 'demo@staywise.com', password: 'staywise123' });
  const [bookings, setBookings] = useState([{ id: 'SW-240614', hotel: hotels[0], dates: 'Jun 14 - 18, 2024', guests: '2 guests', status: 'Confirmed', total: 736 }]);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    getHotels().then((result) => {
      if (result.hotels?.length) setHotelData(result.hotels.map((hotel) => ({
        ...hotel,
        place: [hotel.city, hotel.country].filter(Boolean).join(', '),
        price: hotel.rooms?.[0]?.price || 0,
        reviews: hotel.reviewCount || 0,
        image: hotel.images?.[0] || hotels[0].image,
        tags: hotel.amenities?.slice(0, 2) || [],
        type: 'Staywise stay',
      })));
    }).catch(() => {});
  }, []);

  const visibleHotels = useMemo(() => showAll ? searchResults : searchResults.slice(0, 3), [searchResults, showAll]);
  const guestLabel = guests === 'write-your-own' ? `${writeYourOwnGuestCount} guests` : guests;

  const handleSearch = () => {
    const results = hotelData.filter((hotel) => destination === 'Anywhere' || hotel.place.toLowerCase().includes(destination.toLowerCase()));
    setSearchResults(results);
    setActiveNav('Explore stays');
    setView('explore');
    notify(`${results.length} stays found for ${destination === 'Anywhere' ? 'anywhere' : destination}`);
  };

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };

  const navigate = (label) => {
    setActiveNav(label);
    setView(label === 'Overview' ? 'home' : label === 'Explore stays' ? 'explore' : label === 'My bookings' ? 'bookings' : label === 'Saved places' ? 'saved' : label === 'Hostel dashboard' ? 'admin' : 'settings');
  };

  const toggleSaved = (id) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    try {
      const result = authMode === 'login' ? await login(authForm) : await register(authForm);
      setUser(result.user);
      setView('home');
      setActiveNav('Overview');
      notify(authMode === 'register' ? 'Registration complete. You can now explore stays.' : `Welcome${result.user?.name ? `, ${result.user.name}` : ''}`);
    } catch {
      setUser({ name: authForm.name || 'Sarah Chen', email: authForm.email, role: 'user' });
      setView('home');
      setActiveNav('Overview');
      notify(authMode === 'register' ? 'Registration complete. Demo account is ready.' : 'Demo account ready. Connect MongoDB to persist it.');
    }
  };

  const useDemoAccount = () => {
    setUser({ name: 'Demo Explorer', email: 'demo@staywise.com', role: 'user' });
    setView('home');
    setActiveNav('Overview');
    notify('Demo account signed in');
  };

  const completeBooking = (hotel, bookingDetails) => {
    const booking = { id: `SW-${Date.now().toString().slice(-6)}`, hotel, dates: bookingDetails.dates, guests: bookingDetails.guests, status: 'Confirmed', total: hotel.price * 4 };
    setBookings((current) => [booking, ...current]);
    setSelectedHotel(null);
    navigate('My bookings');
    notify('Booking confirmed. Your itinerary is updated.');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><span /></span><span>staywise</span></div>
        <div className="sidebar-section-label">Workspace</div>
        <nav>
          {navItems.map(({ label, icon: Icon, count }) => (
            <button className={`nav-item ${activeNav === label ? 'active' : ''}`} key={label} onClick={() => navigate(label)}>
              <Icon size={18} strokeWidth={activeNav === label ? 2.4 : 1.8} />
              <span>{label}</span>
              {count && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-section-label manage-label">Manage</div>
        <nav>
          <button className={`nav-item ${activeNav === 'Hostel dashboard' ? 'active' : ''}`} onClick={() => navigate('Hostel dashboard')}><BarChart3 size={18} /><span>Hostel dashboard</span></button>
          <button className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`} onClick={() => navigate('Settings')}><Settings size={18} /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><div><strong>Need a hand?</strong><span>Visit our help center</span></div><ArrowUpRight size={15} /></div>
          <button className="profile-chip" onClick={() => { setView(user ? 'profile' : 'auth'); setActiveNav(user ? 'Profile' : 'Sign in'); }}><span className="avatar">{user ? user.name.slice(0, 2).toUpperCase() : 'SC'}</span><span className="profile-name"><strong>{user?.name || 'Sign in'}</strong><small>{user ? 'Member account' : 'Access your trips'}</small></span><ChevronDown size={15} /></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setToast('Menu is available in the sidebar')}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div>
          <time className="live-date" dateTime={currentTime.toISOString()}>{currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</time><time className="live-clock" dateTime={currentTime.toISOString()}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</time>
          <div className="top-actions"><button className="icon-button notification" aria-label="Notifications" onClick={() => notify('You are all caught up')}><Bell size={19} /><i /></button>{user ? <button className="top-avatar" onClick={() => { setView('profile'); setActiveNav('Profile'); }}>{user.name.slice(0, 2).toUpperCase()}</button> : <button className="top-signin" onClick={() => { setView('auth'); setAuthMode('login'); setActiveNav('Sign in'); }}><UserRound size={15} /> Sign in</button>}</div>
        </header>

        <div className="content-wrap">
          {view === 'auth' && <AuthView mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} onSubmit={submitAuth} onDemo={useDemoAccount} />}
          {view === 'profile' && <ProfileView user={user} onLogin={() => setView('auth')} onExplore={() => navigate('Explore stays')} />}
          {view === 'bookings' && <BookingsView bookings={bookings} onCancel={(id) => { setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: 'Cancelled' } : booking)); notify('Booking cancelled'); }} />}
          {view === 'saved' && <CollectionView title="Saved places" hotels={hotelData.filter((hotel) => saved.includes(hotel.id))} onBook={setSelectedHotel} onSave={toggleSaved} saved={saved} empty="Save a place to see it here." />}
          {view === 'admin' && <AdminView hotels={hotelData} bookings={bookings} />}
          {view === 'settings' && <SettingsView onLogout={() => { setUser(null); notify('Signed out'); }} />}
          {(view === 'home' || view === 'explore') && <>
          <section className="welcome-row">
            <div><p className="eyebrow">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><h1>{view === 'explore' ? 'Find your next stay' : 'Good morning, Sarah'} <span>✦</span></h1><p className="subcopy">{view === 'explore' ? 'Compare places that match your travel rhythm.' : 'Let&apos;s find somewhere that feels like you.'}</p></div>
            <button className="outline-button" onClick={() => notify('Share link copied to clipboard')}><ArrowUpRight size={16} /> Share trip</button>
          </section>

          <section className="search-card">
            <div className="search-card-heading"><div><span className="mini-kicker"><Sparkles size={13} /> SMART MATCH</span><h2>Where would you like to go?</h2></div><button className="filter-link" onClick={() => setShowSearch(!showSearch)}><SlidersHorizontal size={15} /> Filters</button></div>
            <div className="search-fields">
              <label className="search-field destination-field"><span className="field-label"><MapPin size={14} /> Destination</span><select value={destination} onChange={(event) => setDestination(event.target.value)}><option>Anywhere</option><option>Oaxaca, Mexico</option><option>Kyoto, Japan</option><option>Amalfi, Italy</option><option>Lisbon, Portugal</option><option>Bali, Indonesia</option><option>Cape Town, South Africa</option><option>Barcelona, Spain</option></select></label>
              <label className="search-field"><span className="field-label"><CalendarDays size={14} /> Dates</span><input value={dates} onChange={(event) => setDates(event.target.value)} /></label>
              <label className="search-field"><span className="field-label"><UserRound size={14} /> Guests</span><select value={guests} onChange={(event) => setGuests(event.target.value)}><option value="1 guest">1 guest</option><option value="2 guests">2 guests</option><option value="3 guests">3 guests</option><option value="4 guests">4 guests</option><option value="10 guests">10 guests</option><option value="20 guests">20 guests</option><option value="write-your-own">Enter guest count</option></select>{guests === 'write-your-own' && <input className="custom-guest-input" type="number" min="1" max="100" value={writeYourOwnGuestCount} onChange={(event) => setWriteYourOwnGuestCount(event.target.value)} aria-label="Enter guest count" placeholder="Enter guest count" />}</label>
              <button className="search-button" onClick={handleSearch}><Search size={18} /> Find stays</button>
            </div>
            {showSearch && <div className="filter-row"><span>Budget per night</span><input type="range" min="80" max="500" value={budget} onChange={(event) => setBudget(event.target.value)} /><strong>${budget}</strong><span className="filter-pill">Any amenities <ChevronDown size={13} /></span><button className="close-filter" onClick={() => setShowSearch(false)}><X size={15} /></button></div>}
          </section>

          <section className="section-heading"><div><p className="eyebrow">Curated for you</p><h2>Stays worth the detour</h2></div><button className="text-button" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show less' : 'View all stays'} <ArrowUpRight size={16} /></button></section>
          <section className="hotel-grid">
            {visibleHotels.map((hotel) => <HotelCard hotel={hotel} saved={saved.includes(hotel.id)} onSave={() => toggleSaved(hotel.id)} onBook={() => setSelectedHotel({ ...hotel, selectedGuests: guestLabel })} key={hotel.id} />)}
          </section>

          <section className="lower-grid">
            <div className="insight-panel"><div className="panel-title"><div><p className="eyebrow">Your travel rhythm</p><h2>Trips this year</h2></div><button className="icon-button"><ArrowUpRight size={17} /></button></div><div className="trip-stat"><strong>08</strong><span>nights away<br /><em>+24% from last year</em></span></div><div className="bar-chart">{[32, 48, 42, 64, 52, 76, 58, 88, 69, 100, 79, 91].map((height, index) => <div className={`bar ${index === 9 ? 'highlight' : ''}`} style={{ height: `${height}%` }} key={index}><span>{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span></div>)}</div></div>
            <div className="booking-panel"><div className="panel-title"><div><p className="eyebrow">Next up</p><h2>Your itinerary</h2></div><button className="text-button">View all <ArrowUpRight size={15} /></button></div><div className="booking-item"><div className="booking-image" /><div className="booking-info"><strong>Casa Morena</strong><span><MapPin size={12} /> Oaxaca, Mexico</span><small><CalendarDays size={12} /> Jun 14 - 18</small></div><span className="status">Confirmed</span></div></div>
          </section></>}
        </div>
      </main>
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      {selectedHotel && <BookingView hotel={selectedHotel} dates={dates} guests={guestLabel} onClose={() => setSelectedHotel(null)} onConfirm={completeBooking} />}
    </div>
  );
}

function HotelCard({ hotel, saved, onSave, onBook }) {
  return <article className="hotel-card"><div className="hotel-image-wrap"><img src={hotel.image} alt={hotel.name} /><span className="match-badge"><Sparkles size={12} /> 98% match</span><button className={`save-button ${saved ? 'saved' : ''}`} aria-label={`Save ${hotel.name}`} onClick={onSave}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button></div><div className="hotel-card-body"><div className="card-topline"><span>{hotel.type}</span><span className="rating"><Star size={13} fill="currentColor" /> {hotel.rating} <small>({hotel.reviews})</small></span></div><h3>{hotel.name}</h3><p className="hotel-place"><MapPin size={13} /> {hotel.place}</p><div className="tag-row">{hotel.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="price-row"><div><strong>${hotel.price}</strong><span>/ night</span></div><button className="book-button" onClick={onBook}>Book stay</button></div></div></article>;
}

function AuthView({ mode, setMode, form, setForm, onSubmit, onDemo }) {
  return <section className="auth-layout"><div className="auth-visual"><span className="mini-kicker"><Sparkles size={13} /> STAYWISE MEMBER ACCESS</span><h1>Travel well.<br /><em>Feel at home.</em></h1><p>Keep every stay, review, and beautiful detour in one place.</p></div><form className="auth-card" onSubmit={onSubmit}><p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Start exploring'}</p><h2>{mode === 'login' ? 'Sign in to Staywise' : 'Create your account'}</h2>{mode === 'login' && <button className="demo-button" type="button" onClick={onDemo}><Sparkles size={15} /> Continue with demo account</button>}{mode === 'register' && <label className="form-label">Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Sarah Chen" /></label>}<label className="form-label">Username or email<input required type="text" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="demo@staywise.com" /></label><label className="form-label">Password<input minLength="8" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Demo password is ready" /></label><button className="search-button auth-submit" type="submit">{mode === 'login' ? 'Sign in securely' : 'Create account'}</button><p className="switch-auth">{mode === 'login' ? 'New to Staywise?' : 'Already a member?'} <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p></form></section>;
}

function BookingView({ hotel, dates, guests, onClose, onConfirm }) {
  const [payment, setPayment] = useState('card');
  return <div className="modal-backdrop"><section className="booking-modal"><button className="modal-close" onClick={onClose}><X size={18} /></button><div className="modal-image"><img src={hotel.image} alt={hotel.name} /></div><div className="modal-content"><p className="eyebrow">Secure checkout</p><h2>Book {hotel.name}</h2><p className="hotel-place"><MapPin size={13} /> {hotel.place}</p><div className="checkout-grid"><label className="form-label">Check-in / check-out<input value={dates} readOnly /></label><label className="form-label">Guests<select value={guests} readOnly onChange={() => {}}><option>{guests}</option></select></label></div><div className="payment-options"><span className="form-label">Payment method</span><button className={payment === 'card' ? 'payment-option selected' : 'payment-option'} onClick={() => setPayment('card')}><WalletCards size={17} /> Card ending 4242 <Check size={15} /></button><button className={payment === 'later' ? 'payment-option selected' : 'payment-option'} onClick={() => setPayment('later')}><CalendarDays size={17} /> Pay at property</button></div><div className="checkout-total"><span><strong>${hotel.price * 4}</strong> total for 4 nights<small>Free cancellation until Jun 12</small></span><button className="search-button" onClick={() => onConfirm(hotel, { dates, guests })}>Confirm booking</button></div></div></section></div>;
}

function BookingsView({ bookings, onCancel }) { return <section className="page-view"><div className="page-heading"><div><p className="eyebrow">Your travel history</p><h1>My bookings</h1><p className="subcopy">Everything you have planned, in one calm place.</p></div><span className="count-pill">{bookings.length} trips</span></div><div className="booking-list">{bookings.map((booking) => <article className="booking-row" key={booking.id}><img src={booking.hotel.image} alt="" /><div className="booking-info"><strong>{booking.hotel.name}</strong><span><MapPin size={12} /> {booking.hotel.place}</span><small><CalendarDays size={12} /> {booking.dates} · {booking.guests}</small></div><div className="booking-row-meta"><span className={`status ${booking.status === 'Cancelled' ? 'cancelled' : ''}`}>{booking.status}</span><strong>${booking.total}</strong>{booking.status !== 'Cancelled' && <button className="text-button cancel-button" onClick={() => onCancel(booking.id)}>Cancel booking</button>}</div></article>)}</div></section>; }

function CollectionView({ title, hotels: collection, onBook, onSave, saved, empty }) { return <section className="page-view"><div className="page-heading"><div><p className="eyebrow">Your collection</p><h1>{title}</h1><p className="subcopy">Places you want to remember.</p></div></div>{collection.length ? <div className="hotel-grid">{collection.map((hotel) => <HotelCard hotel={hotel} saved={saved.includes(hotel.id)} onSave={() => onSave(hotel.id)} onBook={() => onBook(hotel)} key={hotel.id} />)}</div> : <div className="empty-state"><Heart size={30} /><h2>{empty}</h2><button className="search-button" onClick={() => onBook(hotels[0])}>Explore stays</button></div>}</section>; }

function ProfileView({ user, onLogin, onExplore }) { return <section className="page-view"><div className="profile-hero"><div className="large-avatar">{user ? user.name.slice(0, 2).toUpperCase() : 'SC'}</div><div><p className="eyebrow">Your Staywise profile</p><h1>{user?.name || 'Sarah Chen'}</h1><p className="subcopy">{user?.email || 'Sign in to sync your trips across devices.'}</p></div><button className="search-button" onClick={user ? onExplore : onLogin}>{user ? 'Explore stays' : 'Sign in'}</button></div><div className="profile-stats"><div><strong>08</strong><span>Nights away</span></div><div><strong>04</strong><span>Places saved</span></div><div><strong>4.9</strong><span>Your guest rating</span></div></div></section>; }

function AdminView({ hotels: hotelList, bookings }) {
  const [adminTab, setAdminTab] = useState('Dashboard');
  const facilities = [
    { label: 'Rooms & beds', value: '48 / 64', note: '16 beds available', icon: BedDouble, tone: 'blue' },
    { label: 'Private rooms', value: hotelList.length * 4, note: '4 room types', icon: DoorOpen, tone: 'purple' },
    { label: 'Housekeeping', value: '08', note: 'tasks due today', icon: Wrench, tone: 'orange' },
    { label: 'Dining & meals', value: 'Open', note: 'Breakfast 7-10 AM', icon: Utensils, tone: 'green' },
    { label: 'Wi-Fi coverage', value: '100%', note: 'All floors connected', icon: Wifi, tone: 'teal' },
    { label: 'Laundry service', value: 'Ready', note: 'Same-day service', icon: WashingMachine, tone: 'pink' },
    { label: 'Security', value: 'Active', note: '24/7 reception', icon: ShieldCheck, tone: 'indigo' },
    { label: 'Maintenance', value: '02', note: 'requests in progress', icon: ClipboardList, tone: 'yellow' },
  ];
  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Bookings', icon: CalendarDays },
    { label: 'Rooms', icon: BedDouble },
    { label: 'Facilities', icon: DoorOpen },
    { label: 'Guests', icon: Users },
    { label: 'Staff', icon: UserRound },
    { label: 'Feedback', icon: Star },
  ];
  return <section className="hostel-admin page-view">
    <div className="hostel-admin-nav">{nav.map(({ label, icon: Icon }) => <button className={adminTab === label ? 'active' : ''} onClick={() => setAdminTab(label)} key={label}><Icon size={15} /> {label}</button>)}<button className="admin-logout" onClick={() => setAdminTab('Dashboard')}>Logout</button></div>
    <div className="page-heading"><div><p className="eyebrow">Hostel operations</p><h1>{adminTab}</h1><p className="subcopy">A clear view of your property, people, and daily work.</p></div><button className="search-button"><span>+ Add {adminTab === 'Rooms' ? 'room' : 'booking'}</span></button></div>
    <div className="hostel-stat-grid"><HostelStat label="Total bookings" value={bookings.length} note="All reservations" icon={CalendarDays} tone="blue" /><HostelStat label="Today&apos;s check-ins" value="06" note="2 pending arrival" icon={DoorOpen} tone="green" /><HostelStat label="Total guests" value="42" note="Staying tonight" icon={Users} tone="purple" /><HostelStat label="Today&apos;s revenue" value={`$${bookings.reduce((sum, item) => sum + item.total, 0)}`} note="+12% this week" icon={WalletCards} tone="gold" /><HostelStat label="Available beds" value="16 / 64" note="75% occupancy" icon={BedDouble} tone="teal" /><HostelStat label="Pending requests" value="03" note="Needs attention" icon={ClipboardList} tone="orange" /></div>
    <div className="hostel-dashboard-grid"><div className="hostel-panel"><div className="panel-title"><div><p className="eyebrow">Property overview</p><h2>Basic facilities</h2></div><button className="text-button">Manage all <ArrowUpRight size={15} /></button></div><div className="facility-grid">{facilities.map(({ label, value, note, icon: Icon, tone }) => <div className="facility-card" key={label}><span className={`facility-icon ${tone}`}><Icon size={18} /></span><div><strong>{label}</strong><b>{value}</b><small>{note}</small></div></div>)}</div></div><div className="hostel-panel quick-panel"><div className="panel-title"><div><p className="eyebrow">Today&apos;s activity</p><h2>Quick stats</h2></div><BarChart3 size={18} color="#8c968e" /></div><div className="quick-list"><span>Total guests <strong>42</strong></span><span>Occupied rooms <strong>24 / 32</strong></span><span>Staff on duty <strong>08</strong></span><span>Open requests <strong>03</strong></span></div><div className="system-status"><strong>System status</strong><span><i className="online-dot" /> All services operational</span></div></div></div>
    <div className="admin-table"><div className="table-header"><span>Recent bookings</span><span>Status</span><span>Amount</span></div>{bookings.map((booking) => <div className="table-row" key={booking.id}><span><strong>{booking.hotel.name}</strong><small>{booking.id} · {booking.dates}</small></span><span className="status">{booking.status}</span><strong>${booking.total}</strong></div>)}</div>
  </section>;
}

function HostelStat({ label, value, note, icon: Icon, tone }) { return <div className="hostel-stat"><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div><span className={`stat-icon ${tone}`}><Icon size={19} /></span></div>; }

function SettingsView({ onLogout }) { return <section className="page-view"><div className="page-heading"><div><p className="eyebrow">Workspace preferences</p><h1>Settings</h1><p className="subcopy">Shape how Staywise works for you.</p></div></div><div className="settings-card"><label className="setting-row"><span><strong>Email notifications</strong><small>Booking confirmations and travel reminders</small></span><input type="checkbox" defaultChecked /></label><label className="setting-row"><span><strong>Smart recommendations</strong><small>Use your saved places to improve matches</small></span><input type="checkbox" defaultChecked /></label><button className="outline-button" onClick={onLogout}>Sign out</button></div></section>; }

export default App;

createRoot(document.getElementById('root')).render(<App />);
