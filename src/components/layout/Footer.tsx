'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import aboutData from '@/data/about.json';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    roadmaps: [
      { href: '/roadmap/frontend-roadmap', label: 'Frontend Developer' },
      { href: '/roadmap/backend-developer', label: 'Backend Developer' },
      { href: '/roadmap/fullstack-developer', label: 'Full Stack Developer' },
      { href: '/roadmap/react-roadmap', label: 'React Developer' },
      { href: '/roadmap/dsa-roadmap', label: 'DSA' },
      { href: '/roadmap/javascript-roadmap', label: 'JavaScript' },
    ],
    resources: [
      { href: '/guides', label: 'Guides' },
      { href: '/projects', label: 'Projects' },
      { href: '/blog', label: 'Blog' },
      { href: '/resources', label: 'Resources' },
    ],
    company: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/roadmaps', label: 'All Roadmaps' },
    ],
  };

  const socialLinks = [
    { href: aboutData.github, icon: Github, label: 'GitHub' },
    { href: aboutData.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: `mailto:${aboutData.email}`, icon: Mail, label: 'Email' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Roadmaps
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Interactive roadmaps, guides, and projects to help developers learn new skills and advance their careers. Join thousands of developers on their learning journey.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Roadmaps */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Roadmaps
            </h3>
            <ul className="space-y-3">
              {footerLinks.roadmaps.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
              © {currentYear} Roadmaps. Made with{' '}
              <Heart size={16} className="mx-1 text-red-500" fill="currentColor" />
              by{' '}
              <Link
                href="/about"
                className="ml-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {aboutData.name}
              </Link>
              .
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Contact
              </Link>
              <a
                href={aboutData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}