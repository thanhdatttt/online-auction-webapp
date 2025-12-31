import React from 'react'

const Proposition = () => {
  return (
    <section className="py-24 bg-light border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Why choose Auctiz?</h2>
        <div className="grid md:grid-cols-3 gap-12 mt-16">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-50 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <h4 className="text-xl font-bold text-green-400">Verified Authenticity</h4>
            <p className="text-slate-500">Every item on our platform undergoes a rigorous verification process by certified experts.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h4 className="text-xl font-bold text-blue-600">Secure Transactions</h4>
            <p className="text-slate-500">Our escrow-based payment system ensures your funds are safe until the item is in your hands.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h4 className="text-xl font-bold text-primary">Automated Bidding</h4>
            <p className="text-slate-500">Experience the thrill of a auto bidding auction with our low-latency bidding infrastructure.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Proposition;