import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Bus className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">GlobalBush Quick Ride</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for comfortable and safe bus travel across Cameroon. 
              Connecting cities and communities with reliable transportation services.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/globalbush" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://x.com/Globalbusht" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://www.instagram.com/globalbushtours/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/agencies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Bus Agencies
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Online Booking</span>
              <span className="block text-sm text-muted-foreground">Mobile Tickets</span>
              <span className="block text-sm text-muted-foreground">Travel Insurance</span>
              <span className="block text-sm text-muted-foreground">Customer Support</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">(+237) 677 24 66 24</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">info@globalbushtratour.com</span>
              </div>
              <a href="https://maps.app.goo.gl/hfrWwB66ozc5qv9b6" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Douala Cameroun Carrefour Eto’o Bonamoussadi</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 KamerWays. All rights reserved. Built with ❤️ for travelers across Cameroon.
          </p>
        </div>
      </div>
    </footer>
  );
}