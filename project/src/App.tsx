import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar as CalendarIcon, Clock, Menu, X, ChevronLeft, ChevronRight, Check, User, Phone, Mail,
  MessageSquare, AlertCircle, Sun, Warehouse, LockKeyhole, ShowerHead, Armchair,
  ArrowRight, Search, Inbox, Trash2, Instagram, MapPin, Zap, Loader2,
  CreditCard, Banknote, Copy, QrCode,
} from 'lucide-react';
import {
  supabase,
  generateTimeSlots,
  isArenaOpen,
  formatDateBR,
  toDateString,
  BOOKING_PRICE,
  type Booking,
  type NewBooking,
} from '@/lib/supabase';
import { generatePixCode } from '@/lib/pix';

type View = 'home' | 'booking' | 'my-bookings';

const LOGO_DARK = '/assets/images/freepik_br_ac66e23d-a72f-48a6-b730-b9b49ac1778c.png';
const LOGO_LIGHT = '/assets/images/freepik_br_ac66e23d-a72f-48a6-b730-b9b49ac1778cinvertido.png';

const features = [
  { icon: Warehouse, title: 'Área Coberta', description: 'Jogue com conforto em uma estrutura protegida, faça chuva ou faça sol.' },
  { icon: ShowerHead, title: 'Banheiros e Chuveiro', description: 'Banheiros completos e chuveiro para você sair pronto depois da partida.' },
  { icon: LockKeyhole, title: 'Armários', description: 'Guarde seus pertences com mais tranquilidade enquanto aproveita a arena.' },
  { icon: Armchair, title: 'Futmesa', description: 'Diversão garantida antes ou depois do futvôlei com nossa área de futmesa.' },
  { icon: Sun, title: 'Iluminação Profissional', description: 'Iluminação para você aproveitar os horários da Arena WB com qualidade.' },
  { icon: CalendarIcon, title: 'Horários de Jogo', description: 'Períodos organizados de segunda a sábado para facilitar sua reserva.' },
];

function Logo({ variant = 'dark', className = '' }: { variant?: 'dark' | 'light'; className?: string }) {
  const src = variant === 'light' ? LOGO_LIGHT : LOGO_DARK;
  return <img src={src} alt="Arena WB" className={`object-contain ${className}`} />;
}

function Navbar({ onNavigate, currentView }: { onNavigate: (v: View) => void; currentView: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleNav = (view: View) => { onNavigate(view); setMobileOpen(false); };
  const navLinkClass = (view: string) =>
    `text-sm font-medium transition-colors hover:text-sky-600 ${currentView === view ? 'text-sky-600' : 'text-gray-700'}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
          <Logo variant="dark" className="w-10 h-10 rounded-lg" />
          <span className="font-extrabold text-lg text-gray-900 tracking-tight">
            Arena <span className="text-sky-600">WB</span>
          </span>
        </button>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNav('home')} className={navLinkClass('home')}>Início</button>
          <a href="#sobre" className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors">Sobre</a>
          <a href="#estrutura" className="text-sm font-medium text-gray-700 hover:text-sky-600 transition-colors">Estrutura</a>
          <button onClick={() => handleNav('my-bookings')} className={navLinkClass('my-bookings')}>Meus Agendamentos</button>
          <button onClick={() => handleNav('booking')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-md hover:bg-gray-800 transition-all active:scale-95">
            <CalendarIcon className="w-4 h-4" /> Reservar
          </button>
        </div>
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <button onClick={() => handleNav('home')} className="block w-full text-left py-2 text-gray-700 font-medium">Início</button>
          <a href="#sobre" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Sobre</a>
          <a href="#estrutura" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 font-medium">Estrutura</a>
          <button onClick={() => handleNav('my-bookings')} className="block w-full text-left py-2 text-gray-700 font-medium">Meus Agendamentos</button>
          <button onClick={() => handleNav('booking')} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold shadow-md">
            <CalendarIcon className="w-4 h-4" /> Reservar Horário
          </button>
        </div>
      )}
    </header>
  );
}

function Hero({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gray-950">
      <div className="absolute inset-0">
        <img src="https://images.pexels.com/photos/28207837/pexels-photo-28207837.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Jogador de futvôlei em ação na areia" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-950/60 to-gray-950/95" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex justify-center mb-6">
          <Logo variant="light" className="w-20 h-20 drop-shadow-lg" />
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
          <Zap className="w-4 h-4 text-sky-300" /> Arena profissional de futvôlei
        </span>
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
          Reserve sua quadra e
          <span className="block bg-gradient-to-r from-sky-300 to-white bg-clip-text text-transparent">jogue futvôlei hoje</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          Marque seu horário em segundos. Quadra profissional, área coberta e estrutura completa para você e sua turma.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onBookClick} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-sky-500 text-gray-950 text-base font-semibold shadow-xl hover:bg-sky-400 transition-all active:scale-95">
            <CalendarIcon className="w-5 h-5" /> Agendar Horário
          </button>
          <a href="#sobre" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-base font-semibold hover:bg-white/20 transition-all">
            Conhecer a Arena
          </a>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <Clock className="w-6 h-6 text-sky-300 mx-auto mb-2" />
            <p className="font-extrabold text-2xl sm:text-3xl text-white">17h</p>
            <p className="text-xs sm:text-sm text-gray-300">Seg–Sex: 17h–20h</p>
          </div>
          <div className="text-center">
            <User className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="font-extrabold text-2xl sm:text-3xl text-white">Sáb</p>
            <p className="text-xs sm:text-sm text-gray-300">13h–22h</p>
          </div>
          <div className="text-center">
            <Zap className="w-6 h-6 text-sky-400 mx-auto mb-2" />
            <p className="font-extrabold text-2xl sm:text-3xl text-white">WB</p>
            <p className="text-xs sm:text-sm text-gray-300">Arena Waveboard</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section id="sobre" className="py-20 sm:py-28 bg-gradient-to-br from-gray-950 via-gray-900 to-sky-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">Pronto para entrar na quadra?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Reserve seu horário em menos de um minuto. Escolha a data, o horário e pronto — sua quadra estará garantida.
        </p>
        <button onClick={onBookClick} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-sky-400 text-gray-950 text-base font-semibold shadow-xl hover:bg-sky-300 transition-all active:scale-95 group">
          <CalendarIcon className="w-5 h-5" /> Reservar Agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          {[
            { t: 'Área coberta', s: 'Conforto em qualquer clima' },
            { t: 'Estrutura completa', s: 'Banheiros, armários e chuveiro' },
            { t: 'Futmesa', s: 'Diversão além da quadra' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-white/10">
                <CalendarIcon className="w-6 h-6 text-sky-200" />
              </div>
              <p className="text-white font-semibold text-sm">{item.t}</p>
              <p className="text-gray-400 text-xs mt-1">{item.s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="estrutura" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-900 text-sm font-semibold mb-4">Sobre a Arena</span>
          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-gray-900 leading-tight mb-4">O espaço ideal para o seu futvôlei</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Mais do que uma quadra — um ponto de encontro para amantes do esporte. Ambiente acolhedor, estrutura profissional e a melhor areia da região.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-xl hover:border-sky-200 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-950 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo variant="light" className="w-14 h-14 rounded-lg" />
              <span className="font-extrabold text-lg text-white">Arena <span className="text-sky-400">WB</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">A arena de futvôlei com a melhor estrutura da região. Reserve sua quadra online e venha jogar com a galera.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Instagram className="w-4 h-4 text-sky-400" /><span>@arenawaveboard</span></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /><span>R. Teófilo Otoní, 77 - Petrópolis - Caruaru</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Horário</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-sky-400" /><span>Seg–Sex: 17h às 20h</span></li>
              <li className="text-sm pl-6">Sáb: 13h–16h, 16h–19h, 19h–22h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Arena WB. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

type BookingStep = 'date' | 'time' | 'form' | 'payment' | 'success';
type PaymentMethod = 'pix' | 'cash';

function BookingPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pixCode = generatePixCode(BOOKING_PRICE);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const slots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const fetchBookedSlots = async (dateStr: string) => {
    setLoadingSlots(true);
    const { data, error: queryError } = await supabase
      .from('bookings')
      .select('start_time')
      .eq('booking_date', dateStr)
      .eq('status', 'confirmed');
    if (!queryError && data) {
      setBookedSlots(new Set(data.map((b: { start_time: string }) => b.start_time)));
    }
    setLoadingSlots(false);
  };

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date) || !isArenaOpen(date)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('time');
    fetchBookedSlots(toDateString(date));
  };

  const isPastDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isToday = (date: Date) => toDateString(date) === toDateString(today);

  const isSlotPast = (slotStart: string) => {
    if (!selectedDate || !isToday(selectedDate)) return false;
    const currentHour = new Date().getHours();
    return parseInt(slotStart.split(':')[0], 10) <= currentHour;
  };

  const isSlotBooked = (slotStart: string) => bookedSlots.has(slotStart);

  const handleSlotSelect = (slotStart: string) => {
    if (isSlotBooked(slotStart) || isSlotPast(slotStart)) return;
    setSelectedSlot(slotStart);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setStep('payment');
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setError(null);
    const slot = slots.find((s) => s.start === selectedSlot);
    if (!slot) { setSubmitting(false); return; }

    const newBooking: NewBooking = {
      name: name.trim(), phone: phone.trim(), email: email.trim(),
      booking_date: toDateString(selectedDate), start_time: slot.start, end_time: slot.end,
      payment_method: paymentMethod, price: BOOKING_PRICE,
      notes: notes.trim() || null,
    };
    const { error: insertError } = await supabase.from('bookings').insert(newBooking);
    if (insertError) {
      if (insertError.code === '23505') {
        setError('Esse horário acabou de ser reservado. Por favor, escolha outro.');
        setStep('time'); setSelectedSlot(null);
        fetchBookedSlots(toDateString(selectedDate));
      } else {
        setError('Ocorreu um erro ao fazer a reserva. Tente novamente.');
      }
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setStep('success');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const calendarDays: (Date | null)[] = [];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  for (let i = 0; i < startWeekday; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(year, month, d));

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const canGoPrevMonth = () => new Date(year, month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1);

  const stepIndicator = (
    <div className="flex items-center gap-2 mb-8">
      {[{ key: 'date', label: 'Data', icon: CalendarIcon }, { key: 'time', label: 'Horário', icon: Clock }, { key: 'form', label: 'Dados', icon: User }, { key: 'payment', label: 'Pagamento', icon: CreditCard }].map((s, index) => {
        const isActive = step === s.key;
        const isCompleted = (step === 'time' && s.key === 'date') || (step === 'form' && s.key !== 'form') || (step === 'payment' && s.key !== 'payment') || step === 'success';
        return (
          <div key={s.key} className="flex items-center gap-2">
            {index > 0 && <div className={`w-8 h-0.5 ${isCompleted ? 'bg-sky-500' : 'bg-gray-200'}`} />}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isActive ? 'bg-sky-100 text-sky-700' : isCompleted ? 'text-sky-600' : 'text-gray-400'}`}>
              {isCompleted && !isActive ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (step === 'date') {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          {stepIndicator}
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 mb-2">Escolha a data</h1>
          <p className="text-gray-600 mb-8">Selecione o dia que você quer jogar. Domingo a arena fica fechada.</p>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} disabled={!canGoPrevMonth()} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-lg text-gray-900">{monthNames[month]} {year}</h2>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-gray-100">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((day) => <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) return <div key={index} />;
                const disabled = isPastDate(date) || !isArenaOpen(date);
                const isSelected = selectedDate && toDateString(date) === toDateString(selectedDate);
                const isTodayDate = isToday(date);
                return (
                  <button key={index} onClick={() => handleDateSelect(date)} disabled={disabled}
                    className={`aspect-square rounded-xl text-sm font-medium transition-all relative ${isSelected ? 'bg-gray-900 text-white shadow-md scale-105' : disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-sky-50 hover:scale-105'}`}>
                    {date.getDate()}
                    {isTodayDate && !isSelected && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-900" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-900" /><span>Selecionado</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-200" /><span>Indisponível</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200" /><span>Domingo fechado</span></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'time') {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <button onClick={() => setStep('date')} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          {stepIndicator}
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 mb-2">Escolha o horário</h1>
          <p className="text-gray-600 mb-2 capitalize">{selectedDate && formatDateBR(toDateString(selectedDate))}</p>
          {error && (
            <div className="mb-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
            </div>
          )}
          {loadingSlots ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {slots.map((slot) => {
                const booked = isSlotBooked(slot.start);
                const past = isSlotPast(slot.start);
                const isSelected = selectedSlot === slot.start;
                const disabled = booked || past;
                return (
                  <button key={slot.start} onClick={() => handleSlotSelect(slot.start)} disabled={disabled}
                    className={`px-4 py-4 rounded-xl text-sm font-semibold transition-all border-2 ${isSelected ? 'border-gray-900 bg-gray-900 text-white shadow-md' : booked ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' : past ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' : 'border-gray-200 bg-white text-gray-700 hover:border-sky-400 hover:bg-sky-50 active:scale-95'}`}>
                    <div className="flex items-center justify-center gap-1.5"><Clock className="w-4 h-4" />{slot.label}</div>
                    {booked && <p className="text-xs font-normal mt-1 opacity-70">Reservado</p>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    const slot = slots.find((s) => s.start === selectedSlot);
    return (
      <PaymentStep
        selectedDate={selectedDate}
        slotLabel={slot?.label ?? ''}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        pixCode={pixCode}
        copied={copied}
        onCopyPix={handleCopyPix}
        onBack={() => setStep('form')}
        onConfirm={handleConfirmBooking}
        submitting={submitting}
        error={error}
        price={BOOKING_PRICE}
      />
    );
  }

  if (step === 'success') {
    const slot = slots.find((s) => s.start === selectedSlot);
    const paidWithPix = paymentMethod === 'pix';
    return (
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 flex items-center">
        <div className="max-w-lg mx-auto px-4 sm:px-6 w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-sky-600" strokeWidth={3} />
            </div>
            <h1 className="font-extrabold text-2xl text-gray-900 mb-2">Reserva confirmada!</h1>
            <p className="text-gray-600 mb-8">Seu horário foi reservado com sucesso. Guarde os dados abaixo.</p>
            <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3 mb-8">
              <div className="flex justify-between"><span className="text-gray-500 text-sm">Nome</span><span className="font-semibold text-gray-900 text-sm">{name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 text-sm">Data</span><span className="font-semibold text-gray-900 text-sm capitalize">{selectedDate && formatDateBR(toDateString(selectedDate))}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 text-sm">Horário</span><span className="font-semibold text-gray-900 text-sm">{slot?.label}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 text-sm">Valor</span><span className="font-semibold text-gray-900 text-sm">R$ {BOOKING_PRICE.toFixed(2).replace('.', ',')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 text-sm">Pagamento</span><span className="font-semibold text-gray-900 text-sm">{paidWithPix ? 'PIX' : 'Dinheiro na arena'}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Status pagamento</span>
                {paidWithPix ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Aguardando confirmação</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">Pagar na arena</span>
                )}
              </div>
              <div className="flex justify-between"><span className="text-gray-500 text-sm">Status reserva</span><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">Confirmado</span></div>
            </div>
            {paidWithPix && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-sky-800">Se você ainda não pagou o PIX, escaneie o QR Code ou copie o código na tela anterior. Após o pagamento ser confirmado, o status será atualizado.</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onBack} className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Voltar ao início</button>
              <button onClick={() => { setStep('date'); setSelectedDate(null); setSelectedSlot(null); setName(''); setPhone(''); setEmail(''); setNotes(''); setError(null); setPaymentMethod('pix'); setCopied(false); }} className="flex-1 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">Nova reserva</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const slot = slots.find((s) => s.start === selectedSlot);
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <button onClick={() => setStep('time')} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        {stepIndicator}
        <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 mb-2">Seus dados</h1>
        <p className="text-gray-600 mb-2">
          {selectedDate && <span className="capitalize">{formatDateBR(toDateString(selectedDate))}</span>} — <span className="font-semibold text-gray-900">{slot?.label}</span>
        </p>
        {error && (
          <div className="mt-4 mb-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone / WhatsApp *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Observações (opcional)</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alguma informação adicional?" rows={3} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 resize-none" />
            </div>
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gray-900 text-white font-semibold shadow-md hover:bg-gray-800 hover:shadow-lg transition-all active:scale-[0.98]">
            <CreditCard className="w-5 h-5" /> Ir para Pagamento
          </button>
        </form>
      </div>
    </div>
  );
}

function PaymentStep({
  selectedDate, slotLabel, paymentMethod, setPaymentMethod, pixCode, copied, onCopyPix,
  onBack, onConfirm, submitting, error, price,
}: {
  selectedDate: Date | null;
  slotLabel: string;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  pixCode: string;
  copied: boolean;
  onCopyPix: () => void;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
  error: string | null;
  price: number;
}) {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 mb-2">Forma de pagamento</h1>
        <p className="text-gray-600 mb-2">
          {selectedDate && <span className="capitalize">{formatDateBR(toDateString(selectedDate))}</span>} — <span className="font-semibold text-gray-900">{slotLabel}</span>
        </p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6 mt-3 flex items-center justify-between">
          <span className="text-gray-600 text-sm">Valor da reserva</span>
          <span className="font-extrabold text-2xl text-gray-900">R$ {price.toFixed(2).replace('.', ',')}</span>
        </div>
        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
          </div>
        )}
        <div className="space-y-3 mb-6">
          <button onClick={() => setPaymentMethod('pix')} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'pix' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === 'pix' ? 'bg-sky-500' : 'bg-gray-100'}`}>
              <QrCode className={`w-6 h-6 ${paymentMethod === 'pix' ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">PIX</p>
              <p className="text-sm text-gray-500">Pague agora com QR Code ou Copia e Cola</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'pix' ? 'border-sky-500 bg-sky-500' : 'border-gray-300'}`}>
              {paymentMethod === 'pix' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
          </button>
          <button onClick={() => setPaymentMethod('cash')} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'cash' ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cash' ? 'bg-sky-500' : 'bg-gray-100'}`}>
              <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">Dinheiro</p>
              <p className="text-sm text-gray-500">Pague na arena ao chegar para o jogo</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cash' ? 'border-sky-500 bg-sky-500' : 'border-gray-300'}`}>
              {paymentMethod === 'cash' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
          </button>
        </div>
        {paymentMethod === 'pix' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-56 h-56 bg-white p-3 rounded-xl border-2 border-gray-100 mb-4">
                <QRCodeSVG value={pixCode} size={208} level="M" />
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">Escaneie o QR Code com o app do seu banco ou copie o código abaixo:</p>
              <div className="w-full flex gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-mono truncate">{pixCode}</div>
                <button onClick={onCopyPix} className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${copied ? 'bg-sky-100 text-sky-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                  {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar</>}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Após pagar, clique em confirmar. A reserva será marcada como aguardando confirmação do pagamento.</p>
            </div>
          </div>
        )}
        {paymentMethod === 'cash' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Banknote className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Pagamento na Arena</p>
                <p className="text-sm text-amber-700 mt-1">Sua reserva será confirmada e o pagamento deve ser feito em dinheiro diretamente com o responsável da Arena WB no dia e horário marcados.</p>
              </div>
            </div>
          </div>
        )}
        <button onClick={onConfirm} disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gray-900 text-white font-semibold shadow-md hover:bg-gray-800 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
          {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Confirmando...</> : <><Check className="w-5 h-5" /> Confirmar Reserva</>}
        </button>
      </div>
    </div>
  );
}

function MyBookings({ onBack, onNewBooking }: { onBack: () => void; onNewBooking: () => void }) {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setError(null); setSearched(false);
    const { data, error: queryError } = await supabase
      .from('bookings').select('*').eq('phone', phone.trim())
      .order('booking_date', { ascending: false }).order('start_time', { ascending: false });
    if (queryError) { setError('Erro ao buscar reservas. Tente novamente.'); setLoading(false); return; }
    setBookings((data as Booking[]) || []); setSearched(true); setLoading(false);
  };

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    const { error: updateError } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (updateError) { setError('Erro ao cancelar reserva. Tente novamente.'); setCancellingId(null); return; }
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)));
    setCancellingId(null);
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isUpcoming = (booking: Booking) => new Date(booking.booking_date + 'T00:00:00') >= today && booking.status === 'confirmed';
  const upcoming = bookings.filter(isUpcoming);
  const past = bookings.filter((b) => !isUpcoming(b));

  const renderBookingCard = (booking: Booking) => {
    const cancelled = booking.status === 'cancelled';
    return (
      <div key={booking.id} className={`bg-white rounded-2xl border p-5 transition-all ${cancelled ? 'border-gray-100 opacity-60' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cancelled ? 'bg-gray-100' : 'bg-sky-50'}`}>
              <CalendarIcon className={`w-6 h-6 ${cancelled ? 'text-gray-400' : 'text-sky-600'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm capitalize">{formatDateBR(booking.booking_date)}</p>
              <div className="flex items-center gap-1.5 mt-1"><Clock className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{booking.start_time} - {booking.end_time}</span></div>
              <div className="flex items-center gap-1.5 mt-1">
                {booking.payment_method === 'pix' ? <QrCode className="w-4 h-4 text-gray-400" /> : <Banknote className="w-4 h-4 text-gray-400" />}
                <span className="text-sm text-gray-600">{booking.payment_method === 'pix' ? 'PIX' : 'Dinheiro'} — R$ {Number(booking.price).toFixed(2).replace('.', ',')}</span>
              </div>
              {booking.notes && <p className="text-xs text-gray-500 mt-2 truncate">{booking.notes}</p>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {cancelled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold"><X className="w-3 h-3" /> Cancelado</span>
            ) : booking.payment_status === 'paid' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"><Check className="w-3 h-3" /> Pago</span>
            ) : booking.payment_method === 'cash' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold"><Banknote className="w-3 h-3" /> Pagar na arena</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold"><Clock className="w-3 h-3" /> Aguardando PIX</span>
            )}
            {!cancelled && isUpcoming(booking) && (
              <button onClick={() => handleCancel(booking.id)} disabled={cancellingId === booking.id} className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors disabled:opacity-50">
                {cancellingId === booking.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
          <Search className="w-4 h-4" /> Voltar
        </button>
        <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 mb-2">Meus Agendamentos</h1>
        <p className="text-gray-600 mb-8">Digite seu telefone para ver suas reservas.</p>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
            </div>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold shadow-md hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-60">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>
        </form>
        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
          </div>
        )}
        {searched && !loading && bookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">Nenhuma reserva encontrada</p>
            <p className="text-sm text-gray-500 mb-6">Não encontramos reservas para este telefone.</p>
            <button onClick={onNewBooking} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
              <CalendarIcon className="w-5 h-5" /> Fazer uma reserva
            </button>
          </div>
        )}
        {bookings.length > 0 && (
          <div className="space-y-6">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Próximas reservas ({upcoming.length})</h2>
                <div className="space-y-3">{upcoming.map(renderBookingCard)}</div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Histórico ({past.length})</h2>
                <div className="space-y-3">{past.map(renderBookingCard)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState<View>('home');
  const handleNavigate = (newView: View) => { setView(newView); window.scrollTo({ top: 0, behavior: 'instant' }); };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} currentView={view} />
      {view === 'home' && (
        <main>
          <Hero onBookClick={() => handleNavigate('booking')} />
          <CTA onBookClick={() => handleNavigate('booking')} />
          <About />
        </main>
      )}
      {view === 'booking' && <BookingPage onBack={() => handleNavigate('home')} />}
      {view === 'my-bookings' && <MyBookings onBack={() => handleNavigate('home')} onNewBooking={() => handleNavigate('booking')} />}
      <Footer />
    </div>
  );
}

export default App;
