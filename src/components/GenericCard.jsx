// src/components/GenericActionCard.jsx
import React from "react";

const GenericActionCard = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  links = [],
}) => {
  return (
    <div className="border-2 border-pink-400 rounded-xl p-6 bg-pink-50 flex gap-4 max-w-xl">
      
   
      <div className="flex items-start">
        <div className="w-14 h-14 rounded-full bg-pink-200 flex items-center justify-center">
          {icon}
        </div>
      </div>

    
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <p className="text-gray-600 mt-1">
          {description}
        </p>

     
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-600 transition"
            >
              {primaryAction.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="bg-pink-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-400 transition"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>

     
        {links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 flex items-center gap-1 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericActionCard;
