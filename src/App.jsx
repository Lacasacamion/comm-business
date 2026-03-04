import React, { useState } from 'react';
import { 
  Palette, 
  User, 
  X, 
  PlusCircle, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  LogOut,
  ChevronRight,
  Settings,
  Edit3,
  CreditCard,
  Lock,
  ShoppingBag,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_USERS = [
  {
    id: 1, name: "Elena V.", role: "artist", email: "elena@art.com",
    category: "Ilustración Digital",
    bio: "Ilustradora digital enfocada en surrealismo y color.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    portfolio: [
      { id: 101, title: "Sueños de Neón", price: 150, image: "https://picsum.photos/seed/art1/400/300" },
      { id: 102, title: "Retrato Fractal", price: 200, image: "https://picsum.photos/seed/art2/400/300" },
      { id: 103, title: "Horizonte", price: 120, image: "https://picsum.photos/seed/art3/400/300" },
    ],
    purchases: []
  },
  {
    id: 2, name: "Marco Polo", role: "artist", email: "marco@art.com",
    category: "Pintura Tradicional",
    bio: "Pintor al óleo contemporáneo. Texturas y emociones.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    portfolio: [
      { id: 201, title: "La Espera", price: 300, image: "https://picsum.photos/seed/art4/400/300" },
    ],
    purchases: []
  },
  {
    id: 4, name: "Sofía D.", role: "artist", email: "sofia@art.com",
    category: "Ilustración Digital",
    bio: "Diseñadora de personajes y amante del estilo anime/manga.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    portfolio: [
      { id: 401, title: "Guerrera de Luz", price: 180, image: "https://picsum.photos/seed/art6/400/300" },
      { id: 402, title: "Ciudad Ciberpunk", price: 220, image: "https://picsum.photos/seed/art7/400/300" },
    ],
    purchases: []
  },
  {
    id: 5, name: "Lucas M.", role: "artist", email: "lucas@art.com",
    category: "Pixel Art",
    bio: "Especialista en Pixel Art y animaciones 2D retro.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    portfolio: [
      { id: 501, title: "Castillo 8-bits", price: 80, image: "https://picsum.photos/seed/art8/400/300" },
      { id: 502, title: "Héroe Olvidado", price: 50, image: "https://picsum.photos/seed/art9/400/300" },
      { id: 503, title: "Nave Espacial", price: 90, image: "https://picsum.photos/seed/art10/400/300" },
    ],
    purchases: []
  },
  {
    id: 6, name: "Valeria R.", role: "artist", email: "valeria@art.com",
    category: "Acuarela",
    bio: "Acuarelista botánica. Llevando la naturaleza al lienzo.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Valeria",
    portfolio: [
      { id: 601, title: "Orquídea Azul", price: 250, image: "https://picsum.photos/seed/art11/400/300" },
    ],
    purchases: []
  },
  {
    id: 3, name: "Carlos M.", role: "client", email: "carlos@cliente.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    portfolio: [],
    purchases: []
  }
];

const INITIAL_ORDERS = [
  { id: 1, artistId: 1, clientId: 3, clientName: "Carlos M.", description: "Retrato de mi gato estilo cyberpunk", budget: 100, deadline: "2023-12-01", status: "Pendiente" },
  { id: 2, artistId: 1, clientId: 3, clientName: "Carlos M.", description: "Logotipo para banda de rock", budget: 300, deadline: "2023-11-20", status: "Aceptado" },
];

// --- COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md"
  };
  
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, name, type = "text", placeholder, value, onChange, required = false, as = "input", maxLength }) => {
  const Component = as === "textarea" ? "textarea" : "input";
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Component 
        name={name} type={type} maxLength={maxLength}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        placeholder={placeholder} value={value} onChange={onChange} required={required}
        rows={as === "textarea" ? 4 : undefined}
      />
    </div>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }) => {
  const styles = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',
    'Aceptado': 'bg-blue-100 text-blue-800',
    'Rechazado': 'bg-red-100 text-red-800',
    'Pagado': 'bg-green-100 text-green-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(null); 
  const [artists, setArtists] = useState(INITIAL_USERS.filter(u => u.role === 'artist'));
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [notification, setNotification] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);

  const navigate = (targetView) => { setView(targetView); window.scrollTo(0, 0); };
  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const handleUpdateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    if (updatedUser.role === 'artist') {
      setArtists(prev => prev.map(a => a.id === updatedUser.id ? updatedUser : a));
    }
    showNotification("Perfil actualizado");
    navigate('dashboard');
  };

  const processPayment = (itemType, itemId) => {
    if (itemType === 'order') {
      setOrders(prev => prev.map(o => o.id === itemId ? { ...o, status: 'Pagado' } : o));
      showNotification("¡Pago procesado con éxito! El artista comenzará a trabajar.");
    } else if (itemType === 'artwork') {
      const artwork = checkoutItem.data;
      const updatedUser = { ...user, purchases: [...(user.purchases || []), artwork] };
      setUser(updatedUser);
      showNotification("¡Obra comprada con éxito! Añadida a tu colección.");
    }
    setCheckoutItem(null);
    navigate('dashboard');
  };

  // --- VIEWS ---
  const Navbar = () => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <Palette className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">CommBusiness</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => navigate('home')} className="text-gray-500 hover:text-indigo-600">Inicio</button>
            <button onClick={() => navigate('explore')} className="text-gray-500 hover:text-indigo-600">Explorar</button>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <button onClick={() => navigate('dashboard')} className="text-gray-900 font-medium hover:text-indigo-600">
                  {user.role === 'artist' ? 'Panel Artista' : 'Mi Panel'}
                </button>
                
                <div className="flex items-center gap-3 group relative cursor-pointer">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
                  </div>
                  <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200" />
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 hidden group-hover:block hover:block">
                    <button onClick={() => navigate('edit-profile')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                      <Settings size={16} className="mr-2" /> Editar Perfil
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => { setUser(null); navigate('home'); }} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                      <LogOut size={16} className="mr-2" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => navigate('login')} className="px-4 py-1.5 text-sm">Iniciar Sesión</Button>
                <Button onClick={() => navigate('register')} className="px-4 py-1.5 text-sm">Registrarse</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const CheckoutModal = () => {
    if (!checkoutItem) return null;
    const [isProcessing, setIsProcessing] = useState(false);
    
    const isOrder = checkoutItem.type === 'order';
    const amount = isOrder ? checkoutItem.data.budget : checkoutItem.data.price;
    const title = isOrder ? `Pedido: ${checkoutItem.data.description}` : `Obra: ${checkoutItem.data.title}`;

    const handlePay = (e) => {
      e.preventDefault();
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        processPayment(checkoutItem.type, checkoutItem.data.id);
      }, 2000);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
        <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
          <button onClick={() => !isProcessing && setCheckoutItem(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
            <X size={24} />
          </button>
          
          <div className="bg-gray-50 p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <ShieldCheck className="text-green-500" /> Pago Seguro
            </h2>
            <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Resumen de compra</p>
              <p className="font-semibold text-gray-900 truncate">{title}</p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="text-2xl font-bold text-indigo-600">${amount}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePay} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Vencimiento (MM/AA)" placeholder="12/25" maxLength="5" required />
                <Input label="CVC" placeholder="123" type="password" maxLength="3" required />
              </div>
              <Input label="Nombre en la tarjeta" placeholder="EJ. JUAN PEREZ" required />
            </div>

            <Button type="submit" variant="success" className="w-full mt-6 py-3 text-lg" disabled={isProcessing}>
              {isProcessing ? (
                <span className="flex items-center gap-2"><Lock className="animate-pulse" size={20} /> Procesando...</span>
              ) : (
                <span className="flex items-center gap-2"><Lock size={20} /> Pagar ${amount}</span>
              )}
            </Button>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <Lock size={12} /> Pagos encriptados y procesados de forma segura.
            </p>
          </form>
        </div>
      </div>
    );
  };

  const LoginView = () => {
    const [role, setRole] = useState('client');
    const handleLogin = (e) => {
      e.preventDefault();
      const selectedUser = role === 'client' ? INITIAL_USERS[5] : INITIAL_USERS[0];
      setUser(selectedUser);
      navigate('dashboard');
      showNotification(`¡Bienvenido de nuevo, ${selectedUser.name}!`);
    };

    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-lg">
          <div className="text-center">
            <Palette className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Iniciar Sesión</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="flex justify-center gap-4 mb-4">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" checked={role === 'client'} onChange={() => setRole('client')} /> Perfil Cliente
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" checked={role === 'artist'} onChange={() => setRole('artist')} /> Perfil Artista
               </label>
            </div>
            <Input label="Correo electrónico" placeholder="correo@ejemplo.com" required />
            <Input label="Contraseña" type="password" placeholder="••••••••" required />
            <Button type="submit" className="w-full">Iniciar Sesión</Button>
            <div className="text-center text-sm">
              <span className="text-gray-500">¿No tienes cuenta? </span>
              <button type="button" onClick={() => navigate('register')} className="font-semibold text-indigo-600 hover:text-indigo-500">Regístrate</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const RegisterView = () => {
    const [role, setRole] = useState('client');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = (e) => {
      e.preventDefault();
      const newUser = {
        id: Math.random(),
        name: formData.name,
        email: formData.email,
        role: role,
        category: role === 'artist' ? "Ilustración Digital" : undefined,
        bio: role === 'artist' ? "¡Hola! Soy un nuevo artista en la plataforma." : "",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        portfolio: [],
        purchases: []
      };

      if (role === 'artist') setArtists([...artists, newUser]);
      setUser(newUser);
      navigate(role === 'artist' ? 'dashboard' : 'explore');
      showNotification(`¡Bienvenido, ${newUser.name}!`);
    };

    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Crear Cuenta</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div onClick={() => setRole('client')} className={`cursor-pointer p-4 border-2 rounded-xl text-center transition-all ${role === 'client' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}>
                <User className="mx-auto mb-2" />
                <span className="font-medium">Cliente</span>
              </div>
              <div onClick={() => setRole('artist')} className={`cursor-pointer p-4 border-2 rounded-xl text-center transition-all ${role === 'artist' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}>
                <Palette className="mx-auto mb-2" />
                <span className="font-medium">Artista</span>
              </div>
            </div>
            <Input name="name" label="Nombre completo" required value={formData.name} onChange={handleChange} />
            <Input name="email" label="Correo electrónico" type="email" required value={formData.email} onChange={handleChange} />
            <Input name="password" label="Contraseña" type="password" required value={formData.password} onChange={handleChange} />
            <Button type="submit" className="w-full">Registrarse</Button>
            <div className="text-center text-sm">
              <span className="text-gray-500">¿Ya tienes cuenta? </span>
              <button type="button" onClick={() => navigate('login')} className="font-semibold text-indigo-600 hover:text-indigo-500">Inicia sesión</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ExploreView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todas');
    
    const categories = ['Todas', 'Ilustración Digital', 'Pintura Tradicional', 'Pixel Art', 'Acuarela'];

    const filteredArtists = artists.filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (artist.bio && artist.bio.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'Todas' || artist.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Explorar Talentos</h2>
          <p className="mt-2 text-gray-600">Encuentra al creador perfecto para tu visión</p>
        </div>

        {/* Buscador y Filtros */}
        <div className="mb-10 space-y-6">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o estilo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Filter size={18} className="text-gray-400 mr-2" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Artistas */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist) => (
              <Card key={artist.id} className="cursor-pointer hover:shadow-lg transition-all group" >
                <div onClick={() => { setSelectedArtist(artist); navigate('profile'); }}>
                  <div className="h-48 bg-gray-200 overflow-hidden relative">
                     <img src={artist.portfolio[0]?.image || "https://via.placeholder.com/400x300?text=Arte"} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-indigo-600 shadow-sm">
                       {artist.category || 'Arte'}
                     </div>
                     <img src={artist.avatar} alt={artist.name} className="absolute -bottom-6 left-6 w-12 h-12 rounded-full border-4 border-white bg-white" />
                  </div>
                  <div className="pt-8 pb-6 px-6">
                    <h3 className="text-xl font-bold text-gray-900">{artist.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{artist.bio || "Sin biografía"}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{artist.portfolio.length} obras</span>
                      <span className="text-indigo-600 text-sm font-medium group-hover:underline">Ver perfil</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <Palette className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No se encontraron artistas</h3>
            <p className="text-gray-500">Intenta buscar con otros términos o cambia la categoría.</p>
          </div>
        )}
      </div>
    );
  };

  const ArtistProfileView = () => {
    if (!selectedArtist) return null;
    const [showOrderForm, setShowOrderForm] = useState(false);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-6">
          <img src={selectedArtist.avatar} alt={selectedArtist.name} className="w-24 h-24 rounded-full bg-gray-100 object-cover" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
              {selectedArtist.name}
            </h1>
            <p className="text-indigo-600 font-medium text-sm mt-1">{selectedArtist.category}</p>
            <p className="text-gray-600 mt-2 max-w-2xl">{selectedArtist.bio}</p>
          </div>
          <Button onClick={() => {
            if(!user) { showNotification("Debes iniciar sesión primero"); navigate('login'); return; }
            setShowOrderForm(true);
          }}>Solicitar Pedido Personalizado</Button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">Galería de Obras</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedArtist.portfolio.map((work) => (
            <Card key={work.id} className="flex flex-col">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img src={work.image} alt={work.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{work.title}</h3>
                <div className="flex items-center justify-between mt-auto pt-4">
                  <span className="text-xl font-bold text-indigo-600">${work.price}</span>
                  <Button variant="outline" className="py-1 px-4 text-sm" onClick={() => {
                    if(!user) { showNotification("Debes iniciar sesión para comprar"); navigate('login'); return; }
                    setCheckoutItem({ type: 'artwork', data: work });
                  }}>
                    Comprar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {selectedArtist.portfolio.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
              Este artista aún no ha publicado obras.
            </div>
          )}
        </div>

        {/* Modal de Pedido */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-8 relative">
              <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-6">Solicitud para {selectedArtist.name}</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newOrder = {
                  id: Math.random(), artistId: selectedArtist.id, clientId: user.id, clientName: user.name,
                  description: e.target.desc.value, budget: e.target.budget.value, deadline: e.target.date.value, status: "Pendiente"
                };
                setOrders([...orders, newOrder]);
                setShowOrderForm(false);
                showNotification("¡Solicitud enviada! Revisa tu panel para ver la respuesta.");
              }}>
                <Input name="desc" label="Descripción del pedido" as="textarea" required />
                <div className="grid grid-cols-2 gap-4">
                  <Input name="budget" label="Tu Presupuesto ($)" type="number" required />
                  <Input name="date" label="Fecha Límite" type="date" required />
                </div>
                <Button type="submit" className="w-full mt-4">Enviar Solicitud</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DashboardView = () => {
    if (!user) return null;

    if (user.role === 'artist') {
      const myOrders = orders.filter(o => o.artistId === user.id);
      return (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div><h1 className="text-3xl font-bold text-gray-900">Panel de Artista</h1></div>
            <Button onClick={() => navigate('create-post')}><PlusCircle size={20} className="mr-2" /> Publicar Obra</Button>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-10">
            <Card className="p-6 border-l-4 border-l-indigo-500">
              <h3 className="text-gray-500 font-medium">Pedidos Nuevos</h3>
              <p className="text-3xl font-bold mt-2">{myOrders.filter(o => o.status === 'Pendiente').length}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-green-500">
              <h3 className="text-gray-500 font-medium">Ingresos Pagados</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">
                ${myOrders.filter(o => o.status === 'Pagado').reduce((acc, curr) => acc + Number(curr.budget), 0)}
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <h3 className="text-gray-500 font-medium">Obras en Portafolio</h3>
              <p className="text-3xl font-bold mt-2 text-purple-600">{user.portfolio.length}</p>
            </Card>
          </div>

          <h2 className="text-xl font-bold mb-4">Gestión de Pedidos</h2>
          <Card>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr><th className="p-4">Cliente</th><th className="p-4">Descripción</th><th className="p-4">Monto</th><th className="p-4">Estado</th><th className="p-4 text-right">Acción</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myOrders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{o.clientName}</td>
                    <td className="p-4 max-w-xs truncate">{o.description}</td>
                    <td className="p-4 text-indigo-600 font-bold">${o.budget}</td>
                    <td className="p-4"><Badge status={o.status} /></td>
                    <td className="p-4 text-right">
                      {o.status === 'Pendiente' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setOrders(orders.map(or => or.id === o.id ? {...or, status: 'Aceptado'} : or))} className="text-green-600 bg-green-50 px-3 py-1 rounded hover:bg-green-100">Aceptar</button>
                          <button onClick={() => setOrders(orders.map(or => or.id === o.id ? {...or, status: 'Rechazado'} : or))} className="text-red-600 bg-red-50 px-3 py-1 rounded hover:bg-red-100">Rechazar</button>
                        </div>
                      )}
                      {o.status === 'Pagado' && <span className="text-green-600 font-medium text-xs flex justify-end"><CheckCircle size={16} className="mr-1"/> Listo para iniciar</span>}
                    </td>
                  </tr>
                ))}
                {myOrders.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No tienes pedidos actualmente.</td></tr>}
              </tbody>
            </table>
          </Card>
        </div>
      );
    }

    const myRequestedOrders = orders.filter(o => o.clientId === user.id);
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Panel de Cliente</h1>
        
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingBag className="text-indigo-600"/> Mis Solicitudes de Arte</h2>
        <Card className="mb-12">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-4">Descripción</th><th className="p-4">Presupuesto</th><th className="p-4">Estado</th><th className="p-4 text-right">Pago</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myRequestedOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="p-4">{o.description}</td>
                  <td className="p-4 font-bold">${o.budget}</td>
                  <td className="p-4"><Badge status={o.status} /></td>
                  <td className="p-4 text-right">
                    {o.status === 'Aceptado' && (
                      <Button variant="success" className="py-1 px-4 text-sm inline-flex" onClick={() => setCheckoutItem({ type: 'order', data: o })}>
                        Pagar Ahora
                      </Button>
                    )}
                    {o.status === 'Pagado' && <span className="text-green-600 font-medium">Pagado</span>}
                    {o.status === 'Pendiente' && <span className="text-gray-400 italic">Esperando artista</span>}
                  </td>
                </tr>
              ))}
              {myRequestedOrders.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No has solicitado ningún pedido.</td></tr>}
            </tbody>
          </table>
        </Card>

        <h2 className="text-xl font-bold mb-4">Obras Compradas (Mi Colección)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(user.purchases || []).map((art, idx) => (
            <Card key={idx} className="bg-gray-50 border-2 border-gray-100">
              <img src={art.image} alt={art.title} className="w-full h-40 object-cover opacity-90" />
              <div className="p-4 flex justify-between items-center">
                <span className="font-medium text-gray-800">{art.title}</span>
                <Badge status="Pagado" />
              </div>
            </Card>
          ))}
          {!(user.purchases?.length) && <p className="text-gray-500 col-span-3">Aún no has comprado obras directas.</p>}
        </div>
      </div>
    );
  };

  const CreatePostView = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      
      const newWork = {
        id: Math.random(),
        title: e.target.title.value,
        price: e.target.price.value,
        image: `https://picsum.photos/seed/${Math.random()}/400/300` // Genera imagen aleatoria para demo
      };
      
      const updatedUser = { ...user, portfolio: [newWork, ...user.portfolio] };
      handleUpdateUser(updatedUser); 
      showNotification("¡Obra publicada correctamente!");
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button onClick={() => navigate('dashboard')} className="text-gray-500 hover:text-indigo-600 mb-6 flex items-center gap-2">
           <ChevronRight className="rotate-180" size={20} /> Volver al panel
        </button>
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Publicar Nueva Obra</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <ImageIcon className="mx-auto text-gray-400 mb-3" size={36} />
              <p className="text-indigo-600 font-medium">Seleccionar imagen</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
            </div>
            <Input name="title" label="Título de la obra" placeholder="Ej. Atardecer Abstracto" required />
            <Input name="description" label="Descripción (Opcional)" as="textarea" placeholder="Detalles sobre tu inspiración, técnica, etc..." />
            <Input name="price" label="Precio de venta ($)" type="number" placeholder="150" required />
            <div className="pt-4 border-t border-gray-100">
              <Button type="submit" className="w-full">Publicar en mi galería</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  const EditProfileView = () => {
    if (!user) return null;
    const [formData, setFormData] = useState({
      name: user.name || '', bio: user.bio || '', avatar: user.avatar || '', email: user.email || ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); handleUpdateUser(formData); };

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
         <div className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer hover:text-indigo-600" onClick={() => navigate(user.role === 'artist' ? 'dashboard' : 'explore')}>
            <ChevronRight className="rotate-180" size={20} /> Volver
         </div>
         <Card className="p-8">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className="relative group cursor-pointer">
                <img src={formData.avatar || "https://via.placeholder.com/150"} alt="avatar preview" className="w-20 h-20 rounded-full bg-gray-100 object-cover" />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
                <p className="text-gray-500 text-sm">Actualiza tu información personal</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input name="name" label="Nombre completo" value={formData.name} onChange={handleChange} required />
              <Input name="avatar" label="URL del Avatar (Imagen)" placeholder="https://..." value={formData.avatar} onChange={handleChange} required />
              <Input name="email" label="Correo electrónico" type="email" value={formData.email} onChange={handleChange} required />
              {user.role === 'artist' && (
                <Input name="bio" label="Biografía / Presentación" as="textarea" placeholder="Cuéntanos sobre tu arte..." value={formData.bio} onChange={handleChange} />
              )}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={() => navigate('dashboard')} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1">Guardar Cambios</Button>
              </div>
            </form>
         </Card>
      </div>
    );
  };

  const HomeView = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-6 border border-indigo-100">
              <Palette size={16} /> La nueva comunidad para creadores
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6 leading-tight">
              El arte que buscas, a un <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">clic de distancia</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Conectamos talento emergente con amantes del arte. Compra obras únicas, solicita piezas personalizadas y apoya a creadores independientes de forma 100% segura.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button onClick={() => navigate('explore')} className="w-full sm:w-auto px-8 py-3 text-lg shadow-lg shadow-indigo-200">
                Explorar Artistas <ChevronRight size={20} className="ml-1" />
              </Button>
              {!user && (
                <button onClick={() => navigate('register')} className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
                  Soy artista, quiero unirme <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Collage de imágenes decorativo */}
          <div className="lg:w-1/2 relative lg:h-[500px] w-full flex justify-center lg:justify-end mt-10 lg:mt-0">
             <div className="grid grid-cols-2 gap-4 w-full max-w-md transform lg:rotate-3 hover:rotate-0 transition-transform duration-700">
                <img src="https://picsum.photos/seed/home1/400/500" className="rounded-2xl shadow-lg w-full h-48 sm:h-64 object-cover mt-8" alt="Arte 1" />
                <img src="https://picsum.photos/seed/home2/400/500" className="rounded-2xl shadow-lg w-full h-48 sm:h-64 object-cover" alt="Arte 2" />
                <img src="https://picsum.photos/seed/home3/400/500" className="rounded-2xl shadow-lg w-full h-48 sm:h-64 object-cover" alt="Arte 3" />
                <img src="https://picsum.photos/seed/home4/400/500" className="rounded-2xl shadow-lg w-full h-48 sm:h-64 object-cover -mt-8" alt="Arte 4" />
             </div>
          </div>
          
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-50 py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">¿Por qué usar CommBusiness?</h2>
              <p className="mt-4 text-gray-500">Todo lo que necesitas para vender y comprar arte sin complicaciones.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover:-translate-y-2 transition-transform duration-300 border-none shadow-sm hover:shadow-md">
                 <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                    <Palette size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Arte Auténtico</h3>
                 <p className="text-gray-600 text-sm">Explora cientos de obras originales y encarga piezas personalizadas a creadores verificados.</p>
              </Card>
              
              <Card className="p-8 text-center hover:-translate-y-2 transition-transform duration-300 border-none shadow-sm hover:shadow-md">
                 <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <ShieldCheck size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Pagos Seguros</h3>
                 <p className="text-gray-600 text-sm">Tu dinero está protegido. Procesamos los pagos de manera encriptada y 100% segura.</p>
              </Card>
              
              <Card className="p-8 text-center hover:-translate-y-2 transition-transform duration-300 border-none shadow-sm hover:shadow-md">
                 <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                    <User size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">Trato Directo</h3>
                 <p className="text-gray-600 text-sm">Comunícate directamente con los artistas. Sin intermediarios innecesarios ni comisiones abusivas.</p>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'home': return <HomeView />;
      case 'login': return <LoginView />;
      case 'explore': return <ExploreView />;
      case 'profile': return <ArtistProfileView />;
      case 'dashboard': return <DashboardView />;
      case 'register': return <RegisterView />;
      case 'edit-profile': return <EditProfileView />;
      case 'create-post': return <CreatePostView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <main>{renderContent()}</main>
      <CheckoutModal />
      {notification && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-400" /> {notification}
        </div>
      )}
    </div>
  );
}