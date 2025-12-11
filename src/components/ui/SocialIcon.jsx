import React from 'react';

const icons = {
    phone: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    email: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    instagram: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth={2} />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
        </svg>
    ),
    facebook: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
    )
};

const SocialIcon = ({ type, href, label, className = "", target = "_blank" }) => {
    if (!href) return null;

    return (
        <a 
            href={href} 
            target={target} 
            rel="noreferrer" 
            className={`flex items-center gap-2 text-gray-500 hover:text-[#66CBFF] transition-colors group ${className}`}
        >
            <div className="w-8 h-8 rounded-lg bg-[#66CBFF]/10 flex items-center justify-center group-hover:bg-[#66CBFF] transition-all duration-200 shadow-sm shrink-0 text-[#66CBFF] group-hover:text-white">
                {icons[type]}
            </div>
            {label && (
                <span className="text-xs font-medium truncate max-w-[150px]">{label}</span>
            )}
        </a>
    );
};

export default SocialIcon;
