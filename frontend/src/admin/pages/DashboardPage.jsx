import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Megaphone, FileText, Inbox, ArrowRight, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useContent } from '../../context/ContentContext';
import { fetchMessages } from '../../lib/api';

const Stat = ({ to, icon: Icon, label, value, accent }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 p-5 rounded-xl bg-[#151515] border border-[#f5f5f0]/5 hover:border-amber-500/30 transition-colors"
  >
    <div
      className={
        accent
          ? 'w-11 h-11 rounded-full bg-amber-500/20 flex items-center justify-center'
          : 'w-11 h-11 rounded-full bg-[#f5f5f0]/5 flex items-center justify-center'
      }
    >
      <Icon className={accent ? 'w-5 h-5 text-amber-500' : 'w-5 h-5 text-[#f5f5f0]/50'} />
    </div>
    <div className="flex-1">
      <p className="font-display text-2xl text-[#f5f5f0]">{value}</p>
      <p className="text-[#f5f5f0]/40 font-mono text-[10px] tracking-wider uppercase">
        {label}
      </p>
    </div>
    <ArrowRight className="w-4 h-4 text-[#f5f5f0]/20 group-hover:text-amber-500 transition-colors" />
  </Link>
);

const DashboardPage = ({ onUnreadChange }) => {
  const { content } = useContent();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchMessages()
      .then((data) => {
        setUnread(data.unread);
        onUnreadChange?.(data.unread);
      })
      .catch(() => {
        /* the stat is nice-to-have, not worth an error state */
      });
  }, [onUnreadChange]);

  const films = content?.films?.length ?? 0;
  const ads = content?.ads?.length ?? 0;
  const credits = content?.credits?.length ?? 0;
  const bannerCount = content?.home?.featuredWork?.length ?? 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Everything on your website, editable from here."
      />

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <Stat to="/admin/films" icon={Film} label="Films & TV" value={films} />
        <Stat to="/admin/ads" icon={Megaphone} label="Ads" value={ads} />
        <Stat to="/admin/credits" icon={FileText} label="Credits" value={credits} />
        <Stat
          to="/admin/messages"
          icon={Inbox}
          label={unread === 1 ? 'Unread message' : 'Unread messages'}
          value={unread}
          accent={unread > 0}
        />
      </div>

      {bannerCount === 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[#f5f5f0] text-sm">No banner projects selected</p>
            <p className="text-[#f5f5f0]/50 text-sm mt-1">
              Your home page is showing its automatic fallback.{' '}
              <Link to="/admin/home" className="text-amber-500 hover:underline">
                Choose banner projects
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-[#151515] border border-[#f5f5f0]/5 p-6">
        <h2 className="font-display text-lg text-[#f5f5f0] mb-4">Quick guide</h2>
        <ul className="space-y-2.5 text-sm text-[#f5f5f0]/60">
          <li>
            <strong className="text-[#f5f5f0]/80">Home &amp; Banner</strong> — choose
            which projects rotate behind the big hero image.
          </li>
          <li>
            <strong className="text-[#f5f5f0]/80">Films / Ads / Credits</strong> — add,
            edit, reorder and hide your work. The eye icon hides something without
            deleting it.
          </li>
          <li>
            <strong className="text-[#f5f5f0]/80">About / Contact</strong> — the text on
            those pages, including your biography and the FAQ.
          </li>
          <li>
            <strong className="text-[#f5f5f0]/80">Settings</strong> — your name, email
            and social links, used across the whole site.
          </li>
        </ul>
      </div>
    </>
  );
};

export default DashboardPage;
