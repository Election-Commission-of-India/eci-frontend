import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-eci-primary border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-white font-bold text-center md:text-left">
          © {new Date().getFullYear()} Online Voters' Service Portal.
        </p>

        <div className="flex gap-4 text-sm text-white font-medium"> 
          <a href="/aboutus" className="hover:text-black hover:underline">
            About Us
          </a>
          <a href="/contact" className="hover:text-black hover:underline font-medium">
            Contact
          </a>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
