import { Link } from "react-router";
import Icon from "./Icon.jsx";
import {FaFacebookF, FaGoogle, FaLinkedinIn, FaGithub} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark pt-20 pb-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center space-x-2">
            <Icon />
            <span className="text-3xl font-serif font-bold text-white">Auctiz</span>
          </div>
          <p className="text-white max-w-sm leading-relaxed">
            The world's premier digital auction house. Connecting passionate collectors with extraordinary items since 2025.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center
                        text-slate-500 hover:text-blue-600 hover:border-blue-700 transition-all"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>

            <a
              href="#"
              className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center
                        text-slate-500 hover:text-red-500 hover:border-red-700 transition-all"
            >
              <FaGoogle className="w-4 h-4" />
            </a>

            <a
              href="#"
              className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center
                        text-slate-500 hover:text-sky-600 hover:border-sky-700 transition-all"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>

            <a
              href="https://github.com/thanhdatttt/online-auction-webapp.git"
              className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center
                        text-slate-500 hover:text-slate-900 hover:border-slate-900 transition-all"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-bold text-2xl text-primary mb-6">Contact Us</h5>
          <ul className="space-y-4 text-xl text-amber-50">
            <li>Address: Ho Chi Minh City, Viet Nam</li>
            <li>Phone: +84 123 456 789</li>
            <li>Email: auctizteam@gmail.com</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-2xl text-primary mb-6">Company</h5>
          <ul className="space-y-4 text-xl text-amber-50">
            <li><Link to={"/home"} className="hover:text-primary transition-colors cursor-pointer">Our legacy</Link></li>
            <li><Link to={"/instructions"} className="hover:text-primary transition-colors cursor-pointer">How it Works</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Support Center</a></li>
          </ul>
        </div>
      </div>

      {/* last part */}
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-lg text-white space-y-4 md:space-y-0">
        <p>© 2025 Auctiz Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;