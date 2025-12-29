import {ShieldCheck} from "lucide-react";

const TransactionHeader = () => {
  return (
    <section className="pt-40 pb-16 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-600/5 -skew-x-12 transform translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheck className="text-primary" size={20} />
          <span className="text-primary font-bold uppercase tracking-[0.4em] text-lg">Order dashboard</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-lora text-white mb-8 leading-tight">
          Manage <span className="italic font-bold text-primary">Transactions</span>
        </h1>
      </div>
    </section>
  );
}

export default TransactionHeader;