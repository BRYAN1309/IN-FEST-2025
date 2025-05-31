import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Untuk mengetahui path saat ini
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fungsi untuk scroll ke section
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle navigasi dan scroll untuk link di Navbar
    const handleNavLinkClick = (href: string) => {
        // Jika sedang di halaman dashboard atau path lain selain root ('/'),
        // navigasi dulu ke root lalu scroll.
        // Jika sudah di root, langsung scroll.
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: href.substring(1) } }); // Simpan target scroll di state
        } else {
            scrollToSection(href.substring(1)); // Hapus '#' dari href untuk ID
        }
        setIsMenuOpen(false); // Tutup menu mobile setelah klik
    };

    // Efek untuk menangani scroll setelah navigasi kembali ke root
    useEffect(() => {
        if (location.state && location.state.scrollTo) {
            scrollToSection(location.state.scrollTo);
            // Hapus state agar tidak scroll lagi saat kembali ke halaman ini
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


    // Daftar item navigasi dengan target section yang benar
    const navItems = [
        { name: "About", href: "#features" }, // Mengarah ke 'Why Choose NextPath?'
        { name: "Services", href: "#how-it-works" }, // Mengarah ke 'How It Works'
        { name: "Contact", href: "#contact-footer" }, // Mengarah ke Footer (kita akan tambahkan ID ini di Footer)
    ];

    return (
        <nav className="w-full bg-transparent text-white py-4 px-4 sm:px-6 md:px-8 flex justify-between items-center relative z-50">
            {/* Logo */}
            {/* Saat logo diklik, navigasi ke homepage dan pastikan menu mobile tertutup */}
            <div
                className="text-2xl sm:text-3xl font-bold ml-0 sm:ml-4 cursor-pointer"
                onClick={() => { navigate('/'); setIsMenuOpen(false); }}
            >
                NextPath
            </div>

            {/* Hamburger Menu Icon (untuk mobile) */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md"
                    aria-label="Toggle navigation"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex mt-0 space-x-6 lg:space-x-10 text-sm font-light items-center">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <div className="inline-block group rounded-full">
                            <div
                                className="
                                p-[2px] rounded-full
                                transition-all duration-500 delay-200
                                group-hover:bg-[linear-gradient(90deg,_rgb(255,0,128),_rgb(128,0,255))]
                                group-hover:group-hover:shadow-lg
                                transform
                                "
                            >
                                <a
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault(); // Mencegah default anchor link
                                        handleNavLinkClick(item.href);
                                    }}
                                    className="
                                    block bg-black text-white
                                    rounded-full px-4 py-1.5 text-sm font-semibold
                                    transition-all duration-500
                                    group-hover:text-pink-300
                                    "
                                >
                                    {item.name}
                                </a>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Sign in Button (desktop) */}
            <div className="hidden md:inline-block rounded-full text-base p-[2px] bg-gradient-to-r from-pink-500 to-purple-500 mr-0 sm:mr-4">
                <button
                    onClick={() => navigate("/login")}
                    className="
                    bg-black text-white px-6 py-2 rounded-full
                    transition-all duration-300
                    hover:text-pink-300
                    "
                >
                    Sign in
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-90 z-40 transform ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } md:hidden transition-transform duration-300 ease-in-out`}
            >
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault(); // Mencegah default anchor link
                                handleNavLinkClick(item.href);
                            }}
                            className="text-white text-3xl font-semibold hover:text-pink-300 transition-colors"
                        >
                            {item.name}
                        </a>
                    ))}
                    {/* Tombol Sign in di menu mobile */}
                    <button
                        onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                        className="bg-gradient-to-r from-pink-600 via-purple-500 to-purple-600 hover:from-pink-700 hover:via-purple-600 hover:to-purple-700 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;