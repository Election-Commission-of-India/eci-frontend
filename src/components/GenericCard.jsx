import React from "react";

const GenericActionCard = ({
  icon,
  title,
  imageSrc,
  description,
  primaryAction,
  secondaryAction,
  links = [],
  theme = {},
}) => {
  const {
    border = "border-gray-300",
    bg = "bg-white",
    iconBg = "bg-gray-200",
    primaryBtn = "bg-blue-600 hover:bg-blue-700",
    secondaryBtn = "bg-gray-400 hover:bg-gray-500",
  } = theme;

  return (
    <div
      className={`border-2 ${border} rounded-xl p-6 ${bg} flex gap-4 max-w-xl`}
    >
      {/* Icon */}
      <div className="flex items-start">
        <div
          className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center`}
        >
          <div className="w-10 h-10 md:w-12 md:h-12">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-contain"
              />
            ) : (
              icon
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`${primaryBtn} text-white px-4 py-2 rounded-lg transition`}
            >
              {primaryAction.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`${secondaryBtn} text-white px-4 py-2 rounded-lg transition`}
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
