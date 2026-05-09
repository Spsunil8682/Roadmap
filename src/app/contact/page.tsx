'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  MessageSquare,
  User,
  Briefcase,
} from 'lucide-react';
import aboutData from '@/data/about.json';

export default function ContactPage() {
  const data = aboutData;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || `Hello from ${form.name || 'someone'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have a question, project idea, or just want to say hi? Drop a message —
              I usually reply within a day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 space-y-3"
          >
            <ContactCard
              icon={<Mail size={20} />}
              label="Email"
              value={data.email}
              href={`mailto:${data.email}`}
              gradient="from-blue-500 to-cyan-500"
            />
            <ContactCard
              icon={<Phone size={20} />}
              label="Phone"
              value={data.phone}
              href={`tel:${data.phone.replace(/\s/g, '')}`}
              gradient="from-emerald-500 to-teal-500"
            />
            <ContactCard
              icon={<MapPin size={20} />}
              label="Location"
              value={data.location}
              gradient="from-orange-500 to-pink-500"
            />
            <ContactCard
              icon={<Linkedin size={20} />}
              label="LinkedIn"
              value="Connect with me"
              href={data.linkedin}
              external
              gradient="from-blue-600 to-blue-800"
            />
            <ContactCard
              icon={<Github size={20} />}
              label="GitHub"
              value="See my projects"
              href={data.github}
              external
              gradient="from-gray-700 to-gray-900"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <MessageSquare className="text-blue-600 dark:text-blue-400" size={22} />
                Send a message
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Form opens your mail app pre-filled. No backend, no tracking.
              </p>

              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3"
                >
                  <CheckCircle2 className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" size={18} />
                  <div className="text-sm">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Email app opened
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                      If nothing happened, copy{' '}
                      <a
                        href={`mailto:${data.email}`}
                        className="font-semibold underline"
                      >
                        {data.email}
                      </a>{' '}
                      and email me directly.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    icon={<User size={16} />}
                    label="Your name"
                    type="text"
                    value={form.name}
                    onChange={onChange('name')}
                    required
                  />
                  <Field
                    icon={<Mail size={16} />}
                    label="Your email"
                    type="email"
                    value={form.email}
                    onChange={onChange('email')}
                    required
                  />
                </div>
                <Field
                  icon={<Briefcase size={16} />}
                  label="Subject"
                  type="text"
                  value={form.subject}
                  onChange={onChange('subject')}
                  placeholder="What's this about?"
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={onChange('message')}
                    required
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  <Send size={18} />
                  Send message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Quick FAQs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FAQ
              q="What's the best way to reach you?"
              a="Email is fastest. LinkedIn works too — DMs are open."
            />
            <FAQ
              q="Are you open to freelance?"
              a="Selectively, yes — for frontend / Next.js work. Drop a brief and we'll see if it's a fit."
            />
            <FAQ
              q="How quickly do you reply?"
              a="Usually within 24 hours on weekdays."
            />
            <FAQ
              q="Where are you based?"
              a="Kota, Rajasthan — open to remote and hybrid roles."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  external,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  gradient: string;
}) {
  const content = (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all group">
      <div
        className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {value}
        </p>
      </div>
    </div>
  );
  if (!href) return content;
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="block"
    >
      {content}
    </a>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
        <span className="text-gray-400">{icon}</span>
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{q}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{a}</p>
    </motion.div>
  );
}
