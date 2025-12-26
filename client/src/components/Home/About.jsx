import React from 'react'

const About = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-slate-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            
            <div className="relative aspect-4/5 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200" 
                alt="Auction House Gallery" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 -right-4 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-60">
                <p className="text-4xl font-serif font-bold text-primary mb-1">10+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">
                  Years of Collective Expertise
                </p>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="h-px w-12 bg-primary"></span>
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">
                  Our Legacy
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
                Curating the <span className="italic font-normal text-primary">Extraordinary</span> since inception.
              </h2>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              Auctiz was born from a singular vision: to democratize the world of high-end auctions while preserving the prestige and trust of traditional houses. We bridge the gap between timeless masterpieces and the modern digital collector.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 pt-6">
              <div className="space-y-3">
                <h4 className="text-lg font-serif font-bold text-slate-900 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                  Student Developers & Passion
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Built by a group of software engineering students driven by a shared passion for auction systems, technology, and fair digital marketplaces.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-serif font-bold text-slate-900 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                  Modern Innovation
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Introducing intelligent auto-bidding mechanisms that compete on behalf of users, ensuring optimal bids, transparency, and real-time fairness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;