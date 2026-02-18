import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Search, 
  User, 
  LogIn, 
  Menu, 
  X, 
  PlusCircle, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  Clock,
  Briefcase,
  LogOut,
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';

// --- GEMINI API CONFIG ---
const apiKey = ""; // The execution environment provides the key automatically

// --- MOCK DATA ---
const INITIAL_ARTISTS = [
  {
    id: 1,
    name: "Elena V.",
    role: "artist",
    bio: "Ilustradora digital enfocada en surrealismo y color.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    portfolio: [
      { id: 101, title: "Sueños de Neón", price: 150, image: "https://picsum.photos/seed/art1/400/300" },
      { id: 102, title: "Retrato Fractal", price: 200, image: "https://picsum.photos/seed/art2/400/300" },
      { id: 103, title: "Horizonte", price: 120, image: "https://picsum.photos/seed/art3/400/300" },
    ]
  },
  {
    id: 2,
    name: "Marco Polo",
    role: "artist",
    bio: "Pintor al óleo contemporáneo. Texturas y emociones.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    portfolio: [
      { id: 201, title: "La Espera", price: 300, image: "https://picsum.photos/seed/art4/400/300" },
      { id: 202, title: "Ciudad Gris", price: 250, image: "https://picsum.photos/seed/art5/400/300" },
    ]
  }
];

const INITIAL_ORDERS = [
  { id: 1, artistId: 1, clientName: "Cliente Demo", description: "Retrato de mi gato estilo cyberpunk", budget: 100, deadline: "2023-12-01", status: "Pendiente" },
  { id: 2, artistId: 1, clientName: "Ana G.", description: "Logotipo para banda de rock", budget: 300, deadline: "2023-11-20", status: "Aceptado" },
];

// --- API HELPER ---
const generateContent = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar contenido.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al conectar con la IA. Intenta de nuevo.";
  }
};

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-50 text-green-600 hover:bg-green-100",
    ai: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-600 border border-purple-400/50"
  };
  
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", placeholder, value, onChange, required = false, as = "input", rightElement = null }) => {
  const Component = as === "textarea" ? "textarea" : "input";
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {rightElement}
      </div>
      <Component 
        type={type} 
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
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
    'Aceptado': 'bg-green-100 text-green-800',
    'Rechazado': 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState('home'); // home, login, register, explore, profile, dashboard, create-post
  const [user, setUser] = useState(null); // null or user object
  const [artists, setArtists] = useState(INITIAL_ARTISTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [notification, setNotification] = useState(null);

  // Helper to simulate "Routing"
  const navigate = (targetView) => {
    setView(targetView);
    window.scrollTo(0, 0);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- VIEW COMPONENTS ---

  const Navbar = () => (
    
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <Palette className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">CommBusiness</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => navigate('home')} className="text-gray-500 hover:text-indigo-600 transition-colors">Inicio</button>
            <button onClick={() => navigate('explore')} className="text-gray-500 hover:text-indigo-600 transition-colors">Explorar</button>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                {user.role === 'artist' && (
                   <button onClick={() => navigate('dashboard')} className="text-gray-900 font-medium hover:text-indigo-600">
                     Panel Artista
                   </button>
                )}
                <div className="flex items-center gap-2">
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-gray-100" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button onClick={() => { setUser(null); navigate('home'); }} className="text-gray-400 hover:text-red-500">
                  <LogOut size={20} />
                </button>
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

  const HomeView = () => (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Descubre a la próxima generación de <span className="text-indigo-600">artistas</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Una plataforma curada para conectar coleccionistas con talento emergente. 
            Compra obras únicas o solicita piezas personalizadas directamente al autor.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button onClick={() => navigate('explore')} className="shadow-xl shadow-indigo-200">
              Explorar Artistas <ChevronRight size={18} />
            </Button>
            {!user && (
              <button onClick={() => navigate('register')} className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Soy artista, quiero unirme <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
        {/* Abstract shapes bg */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-30 pointer-events-none">
             <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
             <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </div>
  );

  const LoginView = () => {
    const handleLogin = (e) => {
      e.preventDefault();
      // Mock login - just logs in as the first artist for demo
      setUser(INITIAL_ARTISTS[0]);
      navigate('dashboard');
      showNotification("¡Bienvenido de nuevo, Elena!");
    };

    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6 py-12 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-lg">
          <div className="text-center">
            <Palette className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-sm text-gray-600">Accede a tu panel o pedidos</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="-space-y-px rounded-md shadow-sm">
              <Input label="Correo electrónico" placeholder="artista@ejemplo.com" />
              <Input label="Contraseña" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
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

    const handleRegister = (e) => {
      e.preventDefault();
      const newUser = {
        id: Math.random(),
        name: "Nuevo Usuario",
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        portfolio: []
      };
      if (role === 'artist') {
        setArtists([...artists, newUser]);
      }
      setUser(newUser);
      navigate(role === 'artist' ? 'dashboard' : 'explore');
      showNotification("¡Cuenta creada exitosamente!");
    };

    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6 py-12 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Crear Cuenta</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                onClick={() => setRole('client')}
                className={`cursor-pointer p-4 border-2 rounded-xl text-center transition-all ${role === 'client' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <User className="mx-auto mb-2" />
                <span className="font-medium">Cliente</span>
              </div>
              <div 
                onClick={() => setRole('artist')}
                className={`cursor-pointer p-4 border-2 rounded-xl text-center transition-all ${role === 'artist' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Palette className="mx-auto mb-2" />
                <span className="font-medium">Artista</span>
              </div>
            </div>

            <Input label="Nombre completo" placeholder="Juan Pérez" required />
            <Input label="Correo electrónico" placeholder="juan@ejemplo.com" required />
            <Input label="Contraseña" type="password" placeholder="••••••••" required />

            <Button type="submit" className="w-full">Registrarse como {role === 'client' ? 'Cliente' : 'Artista'}</Button>
          </form>
        </div>
      </div>
    );
  };

  const ExploreView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Explorar Talentos</h2>
        <p className="mt-2 text-gray-600">Encuentra al creador perfecto para tu visión</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artists.map((artist) => (
          <Card key={artist.id} className="hover:shadow-md transition-shadow cursor-pointer group">
            <div onClick={() => { setSelectedArtist(artist); navigate('profile'); }}>
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                 {/* Preview of latest work or placeholder pattern */}
                 {artist.portfolio[0] ? (
                   <img src={artist.portfolio[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Work" />
                 ) : (
                   <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-200">
                     <ImageIcon size={48} />
                   </div>
                 )}
                 <div className="absolute -bottom-6 left-6">
                    <img src={artist.avatar} alt={artist.name} className="w-12 h-12 rounded-full border-4 border-white bg-white" />
                 </div>
              </div>
              <div className="pt-8 pb-6 px-6">
                <h3 className="text-xl font-bold text-gray-900">{artist.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{artist.bio}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{artist.portfolio.length} obras</span>
                  <span className="text-indigo-600 text-sm font-medium group-hover:underline">Ver perfil</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const ArtistProfileView = () => {
    if (!selectedArtist) return null;
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [requestDesc, setRequestDesc] = useState("");
    const [isImproving, setIsImproving] = useState(false);

    const improveRequest = async () => {
        if (!requestDesc.trim()) return;
        setIsImproving(true);
        const prompt = `Actúa como un cliente experto en arte. Reescribe la siguiente solicitud de encargo para un artista para que sea más clara, respetuosa, profesional y detallada, pero mantén la intención original. Solo devuelve el texto mejorado, sin introducciones. Solicitud original: "${requestDesc}"`;
        const result = await generateContent(prompt);
        setRequestDesc(result);
        setIsImproving(false);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-start md:items-center gap-6">
          <img src={selectedArtist.avatar} alt={selectedArtist.name} className="w-24 h-24 rounded-full bg-gray-100" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{selectedArtist.name}</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">{selectedArtist.bio}</p>
          </div>
          <Button onClick={() => setShowOrderForm(true)}>Solicitar Pedido Personalizado</Button>
        </div>

        {/* Gallery */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Galería</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedArtist.portfolio.map((work) => (
            <Card key={work.id}>
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{work.title}</h3>
                <p className="text-indigo-600 font-medium">${work.price}</p>
              </div>
            </Card>
          ))}
          {selectedArtist.portfolio.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              Este artista aún no ha publicado obras.
            </div>
          )}
        </div>

        {/* Order Modal (Simplified) */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-8 relative animate-fade-in-up">
              <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6">Solicitud para {selectedArtist.name}</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                setShowOrderForm(false);
                setRequestDesc("");
                showNotification("¡Solicitud enviada con éxito!");
              }}>
                <Input 
                    label="Descripción del pedido" 
                    as="textarea" 
                    placeholder="Describe lo que quieres (Ej: Un retrato de mi gato con sombrero)..." 
                    value={requestDesc}
                    onChange={(e) => setRequestDesc(e.target.value)}
                    required 
                    rightElement={
                        <button 
                            type="button" 
                            onClick={improveRequest}
                            disabled={isImproving || !requestDesc.trim()}
                            className="text-xs flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800 disabled:opacity-50"
                        >
                            {isImproving ? <Loader2 className="animate-spin h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                            {isImproving ? 'Mejorando...' : 'Mejorar con IA'}
                        </button>
                    }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Presupuesto ($)" type="number" placeholder="100" />
                  <Input label="Fecha Límite" type="date" />
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
    // Basic protection
    if (!user || user.role !== 'artist') return <div className="p-10 text-center">Acceso denegado.</div>;

    const myOrders = orders.filter(o => o.artistId === user.id);

    const handleStatusChange = (orderId, newStatus) => {
      const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      setOrders(updatedOrders);
      showNotification(`Pedido ${newStatus.toLowerCase()}`);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Artista</h1>
            <p className="text-gray-500 mt-1">Gestiona tus pedidos y obras</p>
          </div>
          <Button onClick={() => navigate('create-post')} variant="primary">
            <PlusCircle size={20} className="mr-2" /> Publicar Obra
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 border-l-4 border-l-indigo-500">
            <h3 className="text-gray-500 text-sm font-medium">Pedidos Pendientes</h3>
            <p className="text-3xl font-bold mt-2">{myOrders.filter(o => o.status === 'Pendiente').length}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Ingresos Estimados</h3>
            <p className="text-3xl font-bold mt-2">$450</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-purple-500">
            <h3 className="text-gray-500 text-sm font-medium">Obras Publicadas</h3>
            <p className="text-3xl font-bold mt-2">{user.portfolio.length}</p>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recibidos</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Presupuesto</th>
                  <th className="px-6 py-4">Entrega</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.clientName}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{order.description}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">${order.budget}</td>
                    <td className="px-6 py-4">{order.deadline}</td>
                    <td className="px-6 py-4"><Badge status={order.status} /></td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 'Pendiente' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleStatusChange(order.id, 'Aceptado')} className="text-green-600 hover:bg-green-50 p-1 rounded transition-colors" title="Aceptar">
                            <CheckCircle size={20} />
                          </button>
                          <button onClick={() => handleStatusChange(order.id, 'Rechazado')} className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors" title="Rechazar">
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {myOrders.length === 0 && (
                   <tr>
                     <td colSpan="6" className="px-6 py-8 text-center text-gray-400">No tienes pedidos aún.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CreatePostView = () => {
    // Basic form logic
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateDescription = async () => {
        if (!title.trim()) {
            showNotification("Escribe un título primero para generar la descripción.");
            return;
        }
        setIsGenerating(true);
        const prompt = `Escribe una descripción corta, atractiva y artística (máximo 40 palabras) para una obra de arte titulada "${title}". Enfócate en la emoción y la técnica. Sin comillas.`;
        const result = await generateContent(prompt);
        setDesc(result);
        setIsGenerating(false);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Add a dummy post
      const newWork = {
        id: Math.random(),
        title: title,
        price: price,
        image: `https://picsum.photos/seed/${Math.random()}/400/300`
      };
      
      // Update local state for demo
      const updatedUser = { ...user, portfolio: [newWork, ...user.portfolio] };
      setUser(updatedUser);
      // Update master list
      setArtists(artists.map(a => a.id === user.id ? updatedUser : a));
      
      showNotification("¡Obra publicada correctamente!");
      navigate('dashboard');
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button onClick={() => navigate('dashboard')} className="text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-2">
           ← Volver al panel
        </button>
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Publicar Nueva Obra</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-indigo-600 font-medium">Subir imagen</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
            </div>
            <Input 
                name="title" 
                label="Título de la obra" 
                placeholder="Ej. Atardecer Abstracto" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
            />
            
            <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                <Input 
                    name="description" 
                    label="Descripción" 
                    as="textarea" 
                    placeholder="Detalles técnicos, inspiración..." 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rightElement={
                        <Button 
                            variant="ai" 
                            className="px-3 py-1 text-xs mb-1 h-7" 
                            onClick={generateDescription}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 className="animate-spin h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                            {isGenerating ? 'Generando...' : 'Generar con IA'}
                        </Button>
                    }
                />
            </div>

            <Input 
                name="price" 
                label="Precio referencial ($)" 
                type="number" 
                placeholder="150" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required 
            />
            <div className="pt-4">
              <Button type="submit" className="w-full">Publicar</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  // --- RENDER LOGIC ---

  const renderContent = () => {
    switch (view) {
      case 'home': return <HomeView />;
      case 'login': return <LoginView />;
      case 'register': return <RegisterView />;
      case 'explore': return <ExploreView />;
      case 'profile': return <ArtistProfileView />;
      case 'dashboard': return <DashboardView />;
      case 'create-post': return <CreatePostView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      
      <main>
        {renderContent()}
      </main>

      {/* Footer simple */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 CommBusiness Marketplace. MVP Design.</p>
        </div>
      </footer>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-50 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-400" />
          {notification}
        </div>
      )}
    </div>
  );
}