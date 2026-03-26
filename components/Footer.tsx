
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#f7f5f0] border-t border-gray-100 pt-20 pb-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

        <div>
          <h4 className="text-gray-400 uppercase tracking-widest text-xs mb-6 font-bold">{t('Social')}</h4>
          <ul className="space-y-4 text-sm font-light text-gray-700">
            <li>
              <a 
                href="https://www.instagram.com/alpelmo__dolomites/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#99ccff] transition flex items-center space-x-2 group"
              >
                <span className="group-hover:translate-x-1 transition-transform">Instagram</span>
              </a>
            </li>
            <li>
              <a 
                href="https://www.facebook.com/HotelalPelmoPievediCadore" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#99ccff] transition flex items-center space-x-2 group"
              >
                <span className="group-hover:translate-x-1 transition-transform">Facebook</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 uppercase tracking-widest text-xs mb-6 font-bold">{t('Contact Info')}</h4>
          <address className="not-italic text-sm font-light leading-relaxed text-gray-700">
            Via Nazionale 60<br />
            Pieve di Cadore, Belluno, Italia<br />
            <span className="block mt-2 font-medium text-[#1a1a1a]">+39 0435 500900</span>
            <a href="mailto:info@hotelpelmo.it" className="block hover:text-[#99ccff] transition cursor-pointer">info@hotelpelmo.it</a>
          </address>
        </div>
        <div>
          <h4 className="text-gray-400 uppercase tracking-widest text-xs mb-6 font-bold">{t('Partners')}</h4>
          {/* Partnership Logos */}
          <div className="flex items-center space-x-6">
            <a href="https://www.visitdolomitibellunesi.com/it" target="_blank" rel="noopener noreferrer">
              <img 
                src="/images/logo_dolomiti_bellunese.jpeg" 
                alt="Dolomiti Bellunesi" 
                className="h-12 object-contain grayscale hover:grayscale-0 transition duration-500 opacity-60 hover:opacity-100 cursor-pointer" 
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </a>
            <a href="https://www.dolomiti.org/it/cadore/" target="_blank" rel="noopener noreferrer">
              <img 
                src="/images/cadore_dolomiti_logo.jpeg" 
                alt="Cadore Dolomiti" 
                className="h-12 object-contain grayscale hover:grayscale-0 transition duration-500 opacity-60 hover:opacity-100 cursor-pointer" 
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </a>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-400 border-t border-gray-100 pt-10 font-bold">
        <p>{t('© 2024 Hotel Al Pelmo Ristorante. All rights reserved.')}</p>
      </div>
    </footer>
  );
};

export default Footer;
