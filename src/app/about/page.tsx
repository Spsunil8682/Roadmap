'use client';

import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code2,
  Trophy,
  Star,
  Award,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import aboutData from '@/data/about.json';

const ACH_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2,
  Trophy,
  Star,
  Award,
};

export default function AboutPage() {
  const data = aboutData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32 sm:h-40" />
            <div className="px-6 sm:px-10 pb-8 -mt-16 sm:-mt-20">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-5xl sm:text-6xl font-bold shadow-2xl ring-4 ring-white dark:ring-gray-800"
              >
                {data.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')}
              </motion.div>
              <div className="mt-5">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {data.name}
                </h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-1">
                  {data.title}
                </p>
                <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  {data.summary}
                </p>

                <div className="flex flex-wrap gap-3 mt-5 text-sm">
                  <a
                    href={`mailto:${data.email}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Mail size={14} />
                    {data.email}
                  </a>
                  <a
                    href={`tel:${data.phone}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                  >
                    <Phone size={14} />
                    {data.phone}
                  </a>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <MapPin size={14} />
                    {data.location}
                  </span>
                  <a
                    href={data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                  <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A66C2] text-white hover:bg-[#0950a0] transition-colors"
                  >
                    <Linkedin size={14} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.achievements.map((a, i) => {
            const Icon = ACH_ICONS[a.icon] ?? Trophy;
            return (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mb-2">
                  <Icon size={18} />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                  {a.title}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                  {a.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<Briefcase size={20} />} title="Experience" />
          <div className="space-y-5">
            {data.experience.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${i}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {exp.role}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      {exp.company} · {exp.location}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40 text-blue-700 dark:text-blue-300 self-start whitespace-nowrap">
                    {exp.duration}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {exp.highlights.map((h, hi) => (
                    <li key={hi} className="flex gap-2">
                      <span className="text-blue-500 mt-1.5 shrink-0">•</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<Sparkles size={20} />} title="Selected Projects" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects.map((p, i) => {
              const isExternal = p.url.startsWith('http');
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                isExternal ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all"
                  >
                    {children}
                  </a>
                ) : (
                  <Link
                    href={p.url}
                    className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all"
                  >
                    {children}
                  </Link>
                );
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Wrapper>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h3>
                      <ExternalLink
                        size={14}
                        className="shrink-0 mt-1 text-gray-400 group-hover:text-blue-600 transition-colors"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<Code2 size={20} />} title="Skills" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.skills).map(([cat, items], i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
              >
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  {cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(items as string[]).map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 text-gray-800 dark:text-gray-200 border border-blue-100 dark:border-blue-900"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <SectionHeading icon={<GraduationCap size={20} />} title="Education" />
          <div className="space-y-4">
            {data.education.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {e.school}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {e.degree}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {e.location} · {e.details}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 self-start whitespace-nowrap">
                    {e.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Want to collaborate or just say hi?
            </p>
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Mail size={18} />
              Get in touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-md">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}
