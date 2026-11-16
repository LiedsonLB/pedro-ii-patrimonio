'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Compass, MapPin, Calendar, BookOpen, Image as ImageIcon, PlusCircle,
  Search, ChevronRight, X, ExternalLink, Info, ShieldAlert, Menu, Eye,
  Download, Landmark, CheckCircle, ArrowRight, Printer, Layers,
} from 'lucide-react';

const NAV = [
  { id: 'home', label: 'Início', icon: Compass },
  { id: 'catalog', label: 'Acervo & Catálogo', icon: BookOpen },
  { id: 'map', label: 'Mapa Interativo', icon: MapPin },
  { id: 'history', label: 'História & Linha do Tempo', icon: Calendar },
  { id: 'gallery', label: 'Galeria Fotográfica', icon: ImageIcon },
];

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80';

const emptyForm = {
  name: '',
  category: 'Patrimônios históricos',
  shortDesc: '',
  description: '',
  history: '',
  culturalImportance: '',
  architecture: '',
  address: '',
  coordinates: [-4.425, -41.45],
  yearBuilt: '',
  conservation: 'Bom',
  curiosities: '',
  sources: '',
  keywords: '',
  image: DEFAULT_IMAGE,
};

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#E3D9CE] focus:outline-none focus:border-[#8C6D4F] text-[#2C221E]';
const labelCls = 'block text-xs uppercase font-bold tracking-wider text-[#59473D] mb-2';

function PatrimonyCard({ item, onOpen, showAddress, cta }) {
  return (
    <div
      className="bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#E3D9CE] shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
      onClick={() => onOpen(item)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-[#2C221E]/80 backdrop-blur-md text-[#FDFBF7] text-xs font-medium px-3 py-1 rounded-full">
          {item.category}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-[#2C221E] mb-2 group-hover:text-[#8C6D4F] transition-colors">
          {item.name}
        </h3>
        <p className="text-[#59473D] text-sm mb-4 line-clamp-2">{item.shortDesc}</p>
        <div className="mt-auto pt-4 border-t border-[#E3D9CE] flex items-center justify-between gap-2 text-xs text-[#6B574B]">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-[#8C6D4F] flex-shrink-0" />
            <span className="truncate">{showAddress ? item.address : 'Pedro II - PI'}</span>
          </span>
          <span className="font-semibold text-[#8C6D4F] flex items-center gap-1 group-hover:underline flex-shrink-0">
            {cta} <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title, children, className = 'mb-10' }) {
  return (
    <div className={`${className} text-center max-w-3xl mx-auto`}>
      <span className="text-xs uppercase tracking-widest text-[#8C6D4F] font-bold block mb-2">{kicker}</span>
      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C221E] mb-4">{title}</h1>
      <p className="text-[#59473D]">{children}</p>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [patrimoniesList, setPatrimoniesList] = useState([]);
  const [categories, setCategories] = useState(['Todos']);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPatrimony, setSelectedPatrimony] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mapMode, setMapMode] = useState('osm'); // 'osm' | 'google'
  const [activeMapLocation, setActiveMapLocation] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadPatrimonies = useCallback(async () => {
    const res = await fetch('/api/patrimonios', { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao carregar patrimônios');
    const json = await res.json();
    setPatrimoniesList(json.data);
    setCategories(['Todos', ...json.categorias]);
    setActiveMapLocation((prev) => prev || json.data[0] || null);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [, tl] = await Promise.all([loadPatrimonies(), fetch('/api/timeline')]);
        setTimelineEvents(await tl.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadPatrimonies]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const filteredPatrimonies = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return patrimoniesList.filter((item) => {
      const okCat = selectedCategory === 'Todos' || item.category === selectedCategory;
      const okSearch =
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q));
      return okCat && okSearch;
    });
  }, [patrimoniesList, selectedCategory, searchQuery]);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name || !formData.shortDesc) return;
    try {
      const res = await fetch('/api/patrimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Erro ao salvar');
      await loadPatrimonies();
      setFormSuccess(true);
      setFormData(emptyForm);
      setTimeout(() => setFormSuccess(false), 5000);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patrimoniesList, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'pedro_ii_patrimonios_acervo.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const setField = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const mapSrc = activeMapLocation
    ? mapMode === 'osm'
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${activeMapLocation.coordinates[1] - 0.005},${activeMapLocation.coordinates[0] - 0.005},${activeMapLocation.coordinates[1] + 0.005},${activeMapLocation.coordinates[0] + 0.005}&layer=mapnik&marker=${activeMapLocation.coordinates[0]},${activeMapLocation.coordinates[1]}`
      : `https://maps.google.com/maps?q=${activeMapLocation.coordinates[0]},${activeMapLocation.coordinates[1]}&z=17&output=embed`
    : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C221E] font-sans selection:bg-[#8C6D4F] selection:text-white flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#F5EFEB]/95 backdrop-blur-md border-b border-[#E3D9CE] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-3 text-left group focus:outline-none">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A3B32] to-[#2C221E] flex items-center justify-center text-[#D4AF37] shadow-md group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-serif font-bold text-lg text-[#2C221E] tracking-tight group-hover:text-[#8C6D4F] transition-colors">
                Pedro II - PI
              </span>
              <span className="block text-xs uppercase tracking-widest text-[#6B574B] font-semibold">
                Memória, História e Patrimônio
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV.map(({ id, label, icon: Icon }) => {
              const isActive = currentView === id;
              return (
                <button
                  key={id}
                  onClick={() => setCurrentView(id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-[#4A3B32] text-[#FDFBF7] shadow-sm' : 'text-[#59473D] hover:bg-[#EAE0D5] hover:text-[#2C221E]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C6D4F]'}`} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#EAE0D5] text-[#2C221E] hover:bg-[#DED2C4] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F5EFEB] border-b border-[#E3D9CE] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
            {NAV.map(({ id, label, icon: Icon }) => {
              const isActive = currentView === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setCurrentView(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive ? 'bg-[#4A3B32] text-[#FDFBF7]' : 'text-[#59473D] hover:bg-[#EAE0D5]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C6D4F]'}`} />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {error && (
          <div className="max-w-3xl mx-auto mt-8 px-4">
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">{error}</div>
          </div>
        )}

        {/* HOME */}
        {currentView === 'home' && (
          <div className="animate-fadeIn">
            <section className="relative bg-[#2C221E] text-[#FDFBF7] py-24 lg:py-36 overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"
                  alt="Paisagem de Pedro II"
                  className="w-full h-full object-cover object-center scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E] via-[#2C221E]/60 to-transparent z-0"></div>

              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8C6D4F]/30 border border-[#D4AF37]/40 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-6 shadow-sm">
                  Secretaria Municipal de Cultura • SEMCULT
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                  Pedro II: uma cidade, <br />
                  <span className="text-[#D4AF37] italic">muitas histórias</span>
                </h1>
                <p className="text-lg sm:text-xl text-[#EAE0D5] max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                  Acervo digital oficial para salvaguarda, pesquisa e divulgação dos patrimônios históricos, construções seculares, cultura e belezas naturais do município.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#8C6D4F] hover:bg-[#72573E] text-white font-medium flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    Explorar patrimônios <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentView('history')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent hover:bg-white/10 border border-[#D4AF37]/50 text-[#FDFBF7] font-medium flex items-center justify-center gap-3 transition-all"
                  >
                    Conheça nossa história
                  </button>
                </div>
              </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8C6D4F] font-bold block mb-3">Diagnóstico Situacional da Cultura</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E] mb-6 leading-snug">
                    Raízes portuguesas, tradição da opala e riqueza arquitetônica
                  </h2>
                  <p className="text-[#59473D] text-base sm:text-lg leading-relaxed mb-6">
                    Fundado originalmente como povoado Pequizeiro em 1822 por João Alves Pereira e irmãos, o município foi elevado à vila e batizado como Pedro II em 11 de agosto de 1854. A cidade destaca-se pela herança dos casarões coloniais, pelas únicas jazidas de opala preciosa do Brasil e pelo ecoturismo na Serra dos Matões.
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E3D9CE]">
                    <div>
                      <span className="block font-serif text-3xl font-bold text-[#8C6D4F]">1822</span>
                      <span className="text-sm text-[#6B574B]">Fundação (Pequizeiro)</span>
                    </div>
                    <div>
                      <span className="block font-serif text-3xl font-bold text-[#8C6D4F]">1854</span>
                      <span className="text-sm text-[#6B574B]">Emancipação e Nomeação</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#D4AF37]/10 rounded-3xl transform rotate-2"></div>
                  <img
                    src="https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=1000&q=80"
                    alt="Igreja Matriz de Pedro II"
                    className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover"
                  />
                </div>
              </div>
            </section>

            <section className="bg-[#F5EFEB] py-20 border-y border-[#E3D9CE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#8C6D4F] font-bold block mb-2">Acervo Selecionado</span>
                    <h2 className="font-serif text-3xl font-bold text-[#2C221E]">Pontos de Referência e Memória</h2>
                  </div>
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="mt-4 md:mt-0 text-sm font-semibold text-[#8C6D4F] hover:text-[#2C221E] flex items-center gap-1 transition-colors"
                  >
                    Ver acervo completo <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {loading ? (
                  <p className="text-[#59473D]">Carregando acervo…</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {patrimoniesList.slice(0, 3).map((item) => (
                      <PatrimonyCard key={item.id} item={item} onOpen={setSelectedPatrimony} cta="Conhecer mais" />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* CATÁLOGO */}
        {currentView === 'catalog' && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
            <SectionTitle kicker="Inventário Oficial" title="Catálogo de Patrimônios">
              Consulte fichas técnicas, histórico, endereços e coordenadas dos bens tombados e catalogados em Pedro II - PI.
            </SectionTitle>

            <div className="bg-[#F5EFEB] p-6 rounded-2xl border border-[#E3D9CE] mb-10 shadow-sm space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C6D4F]" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, palavra-chave ou descrição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#E3D9CE] focus:outline-none focus:border-[#8C6D4F] text-[#2C221E] text-base shadow-inner"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E3D9CE]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#4A3B32] text-[#FDFBF7] shadow-sm'
                        : 'bg-[#FDFBF7] text-[#59473D] border border-[#E3D9CE] hover:bg-[#EAE0D5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-center text-[#59473D]">Carregando acervo…</p>
            ) : filteredPatrimonies.length === 0 ? (
              <div className="text-center py-20 bg-[#F5EFEB] rounded-2xl border border-[#E3D9CE]">
                <Info className="w-12 h-12 text-[#8C6D4F] mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-[#2C221E] mb-2">Nenhum patrimônio encontrado</h3>
                <p className="text-[#59473D] text-sm mb-6">Tente ajustar sua busca ou selecionar outra categoria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#4A3B32] text-[#FDFBF7] text-sm font-medium"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPatrimonies.map((item) => (
                  <PatrimonyCard key={item.id} item={item} onOpen={setSelectedPatrimony} showAddress cta="Ficha completa" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MAPA */}
        {currentView === 'map' && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
            <SectionTitle kicker="Geolocalização e Mapeamento Oficial" title="Mapa Interativo de Pedro II">
              Visualize os pontos cadastrados com suas coordenadas exatas e acesse diretamente os links do Google Maps.
            </SectionTitle>

            <div className="bg-[#F5EFEB] rounded-3xl border border-[#E3D9CE] overflow-hidden shadow-lg p-4">
              <div className="bg-[#2C221E] text-[#FDFBF7] p-4 rounded-2xl mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#D4AF37]" />
                  <div>
                    <h3 className="font-serif font-bold text-lg">Pedro II - Piauí, Brasil</h3>
                    <p className="text-xs text-[#EAE0D5]">Coordenadas Centrais: 4.4255° S, 41.4520° W</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#4A3B32] p-1.5 rounded-xl border border-[#8C6D4F]">
                  {[
                    { id: 'osm', label: 'OpenStreetMap (OSM)' },
                    { id: 'google', label: 'Google Maps' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMapMode(m.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        mapMode === m.id ? 'bg-[#D4AF37] text-[#2C221E] shadow' : 'text-[#FDFBF7] hover:bg-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:h-[650px]">
                <div className="w-full lg:w-1/3 bg-[#EAE0D5] rounded-2xl border border-[#D9CEBF] flex flex-col overflow-hidden max-h-[420px] lg:max-h-none">
                  <div className="bg-[#FDFBF7]/95 p-4 border-b border-[#E3D9CE] flex items-center justify-between text-xs text-[#59473D] shadow-sm z-10">
                    <span className="font-bold flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#8C6D4F]" /> Locais Georreferenciados
                    </span>
                    <span className="text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded-md">
                      {patrimoniesList.filter((p) => p.coordinates).length}
                    </span>
                  </div>
                  <div className="flex-grow p-4 overflow-y-auto space-y-3">
                    {patrimoniesList
                      .filter((p) => p.coordinates)
                      .map((item) => {
                        const active = activeMapLocation?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setActiveMapLocation(item)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                              active
                                ? 'bg-[#4A3B32] border-[#8C6D4F] text-[#FDFBF7] shadow-md'
                                : 'bg-[#FDFBF7] border-[#E3D9CE] hover:border-[#8C6D4F] text-[#2C221E] hover:shadow-sm'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-grow">
                              <span className={`text-[10px] uppercase font-bold block truncate mb-0.5 ${active ? 'text-[#D4AF37]' : 'text-[#8C6D4F]'}`}>
                                {item.category}
                              </span>
                              <h5 className="font-serif font-bold text-sm leading-tight line-clamp-2">{item.name}</h5>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="w-full lg:w-2/3 h-[500px] lg:h-auto bg-[#2C221E] rounded-2xl overflow-hidden border border-[#8C6D4F] relative shadow-inner">
                  {mapSrc && (
                    <iframe
                      key={mapSrc}
                      title="Mapa de Pedro II"
                      src={mapSrc}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  )}
                  {activeMapLocation && (
                    <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:w-[340px] pointer-events-none">
                      <div className="bg-[#FDFBF7]/95 backdrop-blur-md shadow-2xl border border-[#E3D9CE] p-4 rounded-2xl pointer-events-auto">
                        <span className="font-bold text-[#2C221E] text-base font-serif leading-tight mb-2 block">
                          {activeMapLocation.name}
                        </span>
                        <div className="text-xs text-[#6B574B] mb-4 flex flex-col gap-1">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#8C6D4F]" /> Lat: {activeMapLocation.coordinates[0]}
                          </span>
                          <span className="flex items-center gap-1.5 ml-5">Lon: {activeMapLocation.coordinates[1]}</span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${activeMapLocation.coordinates[0]},${activeMapLocation.coordinates[1]}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 bg-[#F5EFEB] hover:bg-[#EAE0D5] text-[#59473D] text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#E3D9CE]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Google Maps
                          </a>
                          <button
                            onClick={() => setSelectedPatrimony(activeMapLocation)}
                            className="flex-1 bg-[#4A3B32] hover:bg-[#2C221E] text-[#FDFBF7] text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" /> Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HISTÓRIA */}
        {currentView === 'history' && (
          <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
            <SectionTitle kicker="Diagnóstico Situacional da Cultura" title="Formação Histórica e Institucionalidade" className="mb-12">
              Cronologia oficial da fundação, marcos legislativos, comarcas e evolução da gestão cultural em Pedro II - Piauí.
            </SectionTitle>

            <div className="relative border-l-2 border-[#8C6D4F]/30 ml-4 md:ml-32 space-y-12 py-4">
              {timelineEvents.map((t, index) => (
                <div key={index} className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#8C6D4F] border-4 border-[#FDFBF7] shadow-md group-hover:scale-125 transition-transform"></div>
                  <div className="md:absolute md:-left-36 md:top-1 md:w-28 md:text-right">
                    <span className="inline-block px-3 py-1 rounded-lg bg-[#F5EFEB] border border-[#E3D9CE] text-xs font-bold text-[#8C6D4F]">
                      {t.period}
                    </span>
                  </div>
                  <div className="bg-[#F5EFEB] p-6 sm:p-8 rounded-2xl border border-[#E3D9CE] shadow-sm hover:border-[#8C6D4F] transition-colors">
                    <h3 className="font-serif text-xl font-bold text-[#2C221E] mb-3">{t.title}</h3>
                    <p className="text-[#59473D] text-sm sm:text-base leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-[#F5EFEB] p-8 rounded-2xl border border-[#E3D9CE]">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-[#8C6D4F]" />
                <h3 className="font-serif text-xl font-bold text-[#2C221E]">Fontes e Referências Documentais</h3>
              </div>
              <p className="text-sm text-[#59473D] leading-relaxed mb-4">
                Informações extraídas do documento oficial <strong>Diagnóstico Situacional da Cultura</strong> da Prefeitura Municipal de Pedro II / Secretaria Municipal de Cultura (SEMCULT), em conformidade com as leis provinciais nº 295/1851, nº 367/1854, nº 394/1855 e decretos municipais subsequentes.
              </p>
              <div className="text-xs text-[#6B574B] italic">
                Projeto de Extensão Acadêmica • Secretaria Municipal de Cultura de Pedro II - PI.
              </div>
            </div>
          </div>
        )}

        {/* GALERIA */}
        {currentView === 'gallery' && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
            <SectionTitle kicker="Acervo Fotográfico In Loco" title="Galeria Visual">
              Registros fotográficos dos patrimônios arquitetônicos, naturais e culturais catalogados.
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {patrimoniesList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxImage(item)}
                  className="group relative bg-[#F5EFEB] rounded-2xl overflow-hidden border border-[#E3D9CE] shadow-sm hover:shadow-xl transition-all cursor-pointer h-72"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E]/90 via-[#2C221E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-[#FDFBF7]">
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">{item.category}</span>
                    <h3 className="font-serif font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-xs text-[#EAE0D5] line-clamp-1">{item.address}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-[#D4AF37] font-medium">
                      <Eye className="w-4 h-4" /> Ampliar fotografia
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN */}
        {currentView === 'admin' && (
          <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
            <SectionTitle kicker="Painel de Gestão" title="Cadastrar Novo Patrimônio">
              Adicione novos registros ao acervo digital e exporte os dados consolidados em formato JSON para a SEMCULT.
            </SectionTitle>

            <div className="bg-[#4A3B32] text-[#FDFBF7] p-6 rounded-2xl mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-serif font-bold text-base text-[#D4AF37] mb-1">Exportação de Dados (JSON)</h4>
                  <p className="text-[#EAE0D5] leading-relaxed">
                    Você pode exportar todos os registros cadastrados para backup ou integração com backend Supabase.
                  </p>
                </div>
              </div>
              <button
                onClick={exportJSON}
                className="px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C29F2F] text-[#2C221E] font-bold text-sm flex items-center gap-2 shadow transition-all flex-shrink-0"
              >
                <Download className="w-4 h-4" /> Baixar Acervo (JSON)
              </button>
            </div>

            {formSuccess && (
              <div className="mb-8 bg-[#8C6D4F] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fadeIn">
                <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <h4 className="font-bold">Patrimônio cadastrado com sucesso!</h4>
                  <p className="text-xs text-[#F5EFEB]">O registro foi integrado ao catálogo ativo.</p>
                </div>
              </div>
            )}
            {formError && (
              <div className="mb-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm">{formError}</div>
            )}

            <form onSubmit={handleAdminSubmit} className="bg-[#F5EFEB] p-8 rounded-3xl border border-[#E3D9CE] shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Nome do Local *</label>
                  <input type="text" required placeholder="Ex: Igreja de Nossa Senhora..." value={formData.name} onChange={setField('name')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Categoria *</label>
                  <select value={formData.category} onChange={setField('category')} className={inputCls}>
                    {categories.filter((c) => c !== 'Todos').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Breve Descrição *</label>
                <input type="text" required placeholder="Resumo de uma frase sobre o local" value={formData.shortDesc} onChange={setField('shortDesc')} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Descrição Completa</label>
                <textarea rows={4} placeholder="Histórico detalhado, relevância..." value={formData.description} onChange={setField('description')} className={inputCls} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Endereço</label>
                  <input type="text" placeholder="Ex: Centro, Pedro II - PI" value={formData.address} onChange={setField('address')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Ano ou Período</label>
                  <input type="text" placeholder="Ex: 1854" value={formData.yearBuilt} onChange={setField('yearBuilt')} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates[0]}
                    onChange={(e) => setFormData({ ...formData, coordinates: [parseFloat(e.target.value) || 0, formData.coordinates[1]] })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates[1]}
                    onChange={(e) => setFormData({ ...formData, coordinates: [formData.coordinates[0], parseFloat(e.target.value) || 0] })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Palavras-chave (separadas por vírgula)</label>
                <input type="text" placeholder="Igreja, Século XIX, Matriz" value={formData.keywords} onChange={setField('keywords')} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>URL da Fotografia</label>
                <input type="url" placeholder="https://exemplo.com/foto.jpg" value={formData.image} onChange={setField('image')} className={inputCls} />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-8 py-4 rounded-xl bg-[#4A3B32] hover:bg-[#2C221E] text-[#FDFBF7] font-semibold flex items-center gap-2 shadow-lg transition-all">
                  <PlusCircle className="w-5 h-5 text-[#D4AF37]" /> Salvar e Cadastrar Patrimônio
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL DE FICHA */}
      {selectedPatrimony && (
        <div className="fixed inset-0 z-50 bg-[#2C221E]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FDFBF7] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#E3D9CE] my-8 flex flex-col max-h-[90vh]">
            <div className="relative h-72 sm:h-80 flex-shrink-0">
              <img src={selectedPatrimony.image} alt={selectedPatrimony.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E] via-[#2C221E]/40 to-transparent"></div>
              <button
                onClick={() => setSelectedPatrimony(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#2C221E]/70 hover:bg-[#2C221E] text-white flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block bg-[#8C6D4F] text-xs font-semibold px-3 py-1 rounded-full mb-2">{selectedPatrimony.category}</span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold">{selectedPatrimony.name}</h2>
                <p className="text-sm text-[#EAE0D5] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" /> {selectedPatrimony.address}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C221E] mb-3">Visão Geral</h3>
                <p className="text-[#59473D] leading-relaxed text-base">{selectedPatrimony.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F5EFEB] p-6 rounded-2xl border border-[#E3D9CE]">
                {[
                  ['Ano / Período', selectedPatrimony.yearBuilt || 'Não identificado'],
                  ['Estado de Conservação', selectedPatrimony.conservation || 'Documentado'],
                  ['Arquitetura', selectedPatrimony.architecture || 'Tradicional regional'],
                  [
                    'Coordenadas Geográficas',
                    selectedPatrimony.coordinates
                      ? `${selectedPatrimony.coordinates[0]}, ${selectedPatrimony.coordinates[1]}`
                      : 'Não catalogado',
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C6D4F] mb-1">{label}</h4>
                    <p className="text-[#2C221E] font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {selectedPatrimony.history && (
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C221E] mb-3">Histórico e Contexto</h3>
                  <p className="text-[#59473D] leading-relaxed text-sm sm:text-base">{selectedPatrimony.history}</p>
                </div>
              )}
              {selectedPatrimony.culturalImportance && (
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C221E] mb-3">Importância Cultural e Social</h3>
                  <p className="text-[#59473D] leading-relaxed text-sm sm:text-base">{selectedPatrimony.culturalImportance}</p>
                </div>
              )}
              {selectedPatrimony.curiosities && (
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C221E] mb-3">Curiosidades</h3>
                  <p className="text-[#59473D] leading-relaxed text-sm sm:text-base">{selectedPatrimony.curiosities}</p>
                </div>
              )}
              {selectedPatrimony.sources && (
                <div className="pt-4 border-t border-[#E3D9CE] text-xs text-[#6B574B]">
                  <strong className="font-bold text-[#2C221E]">Fontes e Referências:</strong> {selectedPatrimony.sources}
                </div>
              )}
            </div>

            <div className="bg-[#F5EFEB] px-6 py-4 border-t border-[#E3D9CE] flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#FDFBF7] border border-[#E3D9CE] text-[#59473D] text-sm font-medium flex items-center gap-2 hover:bg-[#EAE0D5]"
              >
                <Printer className="w-4 h-4" /> Imprimir Ficha
              </button>
              <button
                onClick={() => setSelectedPatrimony(null)}
                className="px-6 py-2.5 rounded-xl bg-[#4A3B32] text-[#FDFBF7] text-sm font-medium hover:bg-[#2C221E]"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightboxImage(null)} className="absolute -top-12 right-0 text-white hover:text-[#D4AF37] transition-colors" aria-label="Fechar">
              <X className="w-8 h-8" />
            </button>
            <img src={lightboxImage.image} alt={lightboxImage.name} className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10" />
            <div className="mt-4 text-center text-white">
              <h3 className="font-serif text-xl font-bold">{lightboxImage.name}</h3>
              <p className="text-sm text-gray-300 mt-1">{lightboxImage.address} • {lightboxImage.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* RODAPÉ */}
      <footer className="bg-[#2C221E] text-[#FDFBF7] pt-16 pb-12 border-t border-[#4A3B32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#8C6D4F] flex items-center justify-center text-[#D4AF37]">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg text-white">Pedro II - PI</span>
            </div>
            <p className="text-sm text-[#EAE0D5] leading-relaxed mb-4 font-light">
              Plataforma digital de preservação e catalogação do patrimônio histórico em parceria com a Secretaria Municipal de Cultura (SEMCULT).
            </p>
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#D4AF37] mb-4">Navegação Rápida</h4>
            <ul className="space-y-2.5 text-sm text-[#EAE0D5]">
              {NAV.filter((n) => n.id !== 'admin').map((n) => (
                <li key={n.id}>
                  <button onClick={() => setCurrentView(n.id)} className="hover:text-[#D4AF37] transition-colors">{n.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#D4AF37] mb-4">Fontes Oficiais</h4>
            <ul className="space-y-2.5 text-sm text-[#EAE0D5]">
              <li>Secretaria Municipal de Cultura (SEMCULT)</li>
              <li>Diagnóstico Situacional da Cultura</li>
              <li>Lei Provincial nº 367/1854</li>
              <li>Acervo do Projeto de Extensão</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#D4AF37] mb-4">Desenvolvimento</h4>
            <p className="text-xs text-[#EAE0D5] leading-relaxed mb-4">
              Plataforma desenvolvida com Next.js, Tailwind CSS e OpenStreetMap para salvaguarda da memória municipal.
            </p>
            <div className="text-xs text-[#D4AF37] font-semibold">Pedro II - Piauí • Brasil</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#4A3B32] flex flex-col sm:flex-row items-center justify-between text-xs text-[#EAE0D5]">
          <p>© {new Date().getFullYear()} Pedro II: Memória, História e Patrimônio. Todos os direitos reservados.</p>
          <p className="mt-2 sm:mt-0">Pronto para publicação na Vercel • Next.js</p>
        </div>
      </footer>
    </div>
  );
}
