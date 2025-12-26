import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Gem, 
  Search, 
  Zap, 
  ShieldCheck, 
  Camera, 
  Megaphone, 
  Wallet,
  ArrowRight
} from 'lucide-react';


const InstructionLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Sophisticated & Premium Header */}
      <section className="relative pt-44 pb-32 bg-slate-950 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-amber-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-slate-800 rounded-full blur-[100px]"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <button 
            onClick={() => navigate("/home")}
            className="group mb-12 inline-flex items-center space-x-2 text-primary hover:text-accent transition-all duration-300"
          >
            <ArrowLeft size={14} className="mr-1 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-[0.3em]">
              Back to Marketplace
            </span>
          </button>

          <div className="space-y-6">
            <div className="inline-flex items-center space-x-3 mb-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-primary font-bold uppercase tracking-[0.4em] text-xl">
                The Auctiz Process
              </span>
              <span className="h-px w-8 bg-primary"></span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight">
              Mastering the <br />
              <span className="italic font-normal text-primary relative inline-block">
                Art of Bidding
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-slate-100 text-xl max-w-2xl mx-auto leading-relaxed font-light">
              A transparent and secure auction platform featuring real-time bidding and automatic bidding mechanisms for both collectors and sellers.
            </p>
          </div>
        </div>
        
        {/* Subtle Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-white to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-24 items-start">
          
          {/* Buying Side */}
          <div className="space-y-16 p-10 rounded-[3rem] bg-amber-200 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-700">
               <ShoppingBag size={120}  className="text-primary"/>
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center">
              <span className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mr-4 shadow-lg shadow-amber-600/20">
                <ShoppingBag size={20} />
              </span>
              For Bidders
            </h2>
            <div className="space-y-12 relative">
              <div className="flex space-x-8 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Search size={20} className="text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Browse & Discover</h4>
                  <p className="text-slate-500 leading-relaxed">Explore a curated selection of rare assets. Each listing features detailed provenance and high-resolution imagery.</p>
                </div>
              </div>
              <div className="flex space-x-8 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Zap size={20} className="text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Automatic Bidding</h4>
                  <p className="text-slate-500 leading-relaxed">Set your maximum bid once and let the system automatically place bids on your behalf, ensuring competitiveness.</p>
                </div>
              </div>
              <div className="flex space-x-8 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <ShieldCheck size={20} className="text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">White-Glove Closing</h4>
                  <p className="text-slate-500 leading-relaxed">Payments are held in escrow. We manage professional shipping and insurance until the item arrives at your door.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Selling Side */}
          <div className="space-y-16 p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-700">
               <Gem size={120} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-primary flex items-center">
              <span className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center mr-4 shadow-lg">
                <Gem size={20} />
              </span>
              For Sellers
            </h2>
            <div className="space-y-12 relative">
              <div className="flex space-x-8 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Camera size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Smart Auction Setup</h4>
                  <p className="text-slate-400 leading-relaxed">Easily configure starting price, minimum increments, and automatic bidding to attract competitive and fair bidding from the start.</p>
                </div>
              </div>
              <div className="flex space-x-8 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Megaphone size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Elite Promotion</h4>
                  <p className="text-slate-400 leading-relaxed">Our marketing team puts your item in front of the world's most serious collectors and institutional bidders.</p>
                </div>
              </div>
              <div className="flex space-x-8 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Wallet size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Seamless Payout</h4>
                  <p className="text-slate-400 leading-relaxed">Funds are released to you immediately upon bidder verification. We handle all the complex logistics.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Simplified CTA */}
      <section className="py-24 bg-amber-400 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="text-3xl font-serif font-bold text-slate-900 mb-8 tracking-tight">Begin your journey in the world of fine auctions.</h3>
          <button 
            onClick={() => navigate("/auctions")}
            className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-200 bg-slate-900 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-primary hover:text-black"
          >
            <span>Start Exploring Now</span>
            <ArrowRight size={20} className="ml-3 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default InstructionLayout;