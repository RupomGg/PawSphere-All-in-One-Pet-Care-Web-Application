import React from 'react';

const Footer = () => {
    return (
        <div>
            <footer 
                className="footer p-10 text-neutral-content" 
                style={{
                    background: 'linear-gradient(90deg, hsla(70, 10%, 89%, 1) 0%, hsla(70, 7%, 82%, 1) 100%)',
                    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#E4E5DF", endColorstr="#D3D4CE", GradientType=1)',
                    borderTop: '1px solid #ddd',  // Optional, adds a nice separation line
                }}
            >
                <nav>
                    <header className="footer-title text-lg font-semibold mb-4">Services</header>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Branding</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Design</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Marketing</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Advertisement</a>
                </nav> 
                <nav>
                    <header className="footer-title text-lg font-semibold mb-4">Company</header>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">About us</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Contact</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Jobs</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Press kit</a>
                </nav> 
                <nav>
                    <header className="footer-title text-lg font-semibold mb-4">Legal</header>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Terms of use</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Privacy policy</a>
                    <a className="link link-hover text-gray-600 hover:text-blue-600 transition duration-300 ease-in-out">Cookie policy</a>
                </nav>

                {/* Footer Bottom */}
                <div className="mt-10 text-center text-gray-500 text-sm">
                    <p>&copy; 2025 Your Company. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
