import React from 'react';

const Footer: React.FC = () => {
  return (
    // Tambahkan ID 'contact-footer' dan sesuaikan padding responsif
    <footer id="contact-footer" className="bg-transparent text-white py-8 md:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Grid ini akan menjadi 1 kolom di mobile, 2 kolom di sm, dan 3 kolom di md */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left"> {/* Tambahkan text-center/sm:text-left untuk alignment */}
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4"> {/* Kurangi space-y di mobile */}
            <h2 className="text-xl sm:text-2xl font-bold">NextPath</h2> {/* Sesuaikan ukuran font */}
            <div className="w-16 sm:w-24 h-0.5 bg-white mx-auto sm:mx-0"></div> {/* Lebar garis responsif, mx-auto untuk center di mobile */}
            <p className="text-gray-400 text-xs sm:text-sm"> {/* Sesuaikan ukuran font */}
              All Rights Reserved NextPath©NextPath2025
            </p>
          </div>

          {/* Products Section */}
          <div className="space-y-3 sm:space-y-4"> {/* Kurangi space-y di mobile */}
            <h3 className="text-lg sm:text-xl font-semibold">Products</h3> {/* Sesuaikan ukuran font */}
            <ul className="space-y-1.5 sm:space-y-2"> {/* Kurangi space-y di mobile */}
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Landing Page
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  AI Chatbox
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Articles
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="space-y-3 sm:space-y-4"> {/* Kurangi space-y di mobile */}
            <h3 className="text-lg sm:text-xl font-semibold">Contact Us</h3> {/* Sesuaikan ukuran font */}
            <ul className="space-y-1.5 sm:space-y-2"> {/* Kurangi space-y di mobile */}
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Whatsapp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  LINE
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Support Section */}
        {/* Tata letak fleksibel: kolom di mobile, row di md */}
        <div className="mt-8 pt-6 sm:pt-8 border-t border-gray-700"> {/* Kurangi pt di mobile */}
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left"> {/* Tambahkan text-center/md:text-left untuk alignment */}
            <div className="mb-4 md:mb-0">
              <h4 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2">Support us</h4> {/* Sesuaikan ukuran font dan mb */}
              <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4"> {/* justify-center di mobile */}
                {/* TikTok */}
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>

                {/* Twitter/X */}
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Twitter/X"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="text-center md:text-right text-sm sm:text-base"> {/* Sesuaikan ukuran font */}
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Privacy Policy & Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;