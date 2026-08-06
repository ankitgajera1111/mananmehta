import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Mail, MailOpen, Trash2, Reply, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import PageHeader from '../components/PageHeader';
import { fetchMessages, setMessageRead, deleteMessage, errorMessage } from '../../lib/api';
import { cn } from '../../lib/utils';

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MessagesPage = ({ onUnreadChange }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setItems(data.items);
      onUnreadChange?.(data.unread);
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [onUnreadChange]);

  useEffect(() => {
    load();
  }, [load]);

  // Opening a message marks it read, which is what a person expects; no
  // separate "mark as read" step to remember.
  const toggleExpand = async (message) => {
    const opening = expandedId !== message.id;
    setExpandedId(opening ? message.id : null);
    if (opening && !message.read) {
      try {
        await setMessageRead(message.id, true);
        load();
      } catch {
        /* non-critical */
      }
    }
  };

  const toggleRead = async (message, event) => {
    event.stopPropagation();
    try {
      await setMessageRead(message.id, !message.read);
      load();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update.'));
    }
  };

  const confirmDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteMessage(target.id);
      toast.success('Message deleted');
      load();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete.'));
    }
  };

  return (
    <>
      <PageHeader
        title="Messages"
        description="Enquiries sent through the contact form."
      >
        <Button
          variant="outline"
          onClick={load}
          className="border-[#f5f5f0]/20 text-[#f5f5f0] hover:bg-[#f5f5f0]/10"
        >
          Refresh
        </Button>
      </PageHeader>

      {loading && (
        <div className="flex items-center gap-3 text-[#f5f5f0]/40 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading…
        </div>
      )}

      {error && !loading && <p className="text-red-300 text-sm">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl bg-[#151515] border border-dashed border-[#f5f5f0]/10 p-12 text-center">
          <Inbox className="w-8 h-8 text-[#f5f5f0]/20 mx-auto mb-3" />
          <p className="text-[#f5f5f0]/40">No messages yet.</p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((message) => (
          <div
            key={message.id}
            className={cn(
              'rounded-xl border transition-colors',
              message.read
                ? 'bg-[#151515] border-[#f5f5f0]/5'
                : 'bg-amber-500/[0.04] border-amber-500/20'
            )}
          >
            <button
              onClick={() => toggleExpand(message)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  message.read ? 'bg-transparent' : 'bg-amber-500'
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p
                    className={cn(
                      'truncate',
                      message.read ? 'text-[#f5f5f0]/80' : 'text-[#f5f5f0] font-medium'
                    )}
                  >
                    {message.name}
                  </p>
                  <span className="text-[#f5f5f0]/30 text-xs truncate">
                    {message.email}
                  </span>
                </div>
                <p className="text-[#f5f5f0]/40 text-sm truncate mt-0.5">
                  {message.message}
                </p>
              </div>
              <span className="text-[#f5f5f0]/30 text-xs whitespace-nowrap hidden sm:block">
                {formatDate(message.createdAt)}
              </span>
            </button>

            {expandedId === message.id && (
              <div className="px-4 pb-4 pt-1 border-t border-[#f5f5f0]/5 mt-1">
                {message.projectType && (
                  <p className="text-[#f5f5f0]/50 text-xs mb-3">
                    Project type:{' '}
                    <span className="text-amber-500/80">{message.projectType}</span>
                  </p>
                )}
                <p className="text-[#f5f5f0]/70 whitespace-pre-wrap mb-4">
                  {message.message}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(
                      'Re: your enquiry'
                    )}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500 text-[#0a0a0a] text-sm hover:bg-amber-400"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </a>
                  <button
                    onClick={(e) => toggleRead(message, e)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[#f5f5f0]/60 text-sm hover:text-[#f5f5f0] hover:bg-[#f5f5f0]/10"
                  >
                    {message.read ? (
                      <>
                        <Mail className="w-4 h-4" />
                        Mark unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-4 h-4" />
                        Mark read
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setPendingDelete(message)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[#f5f5f0]/60 text-sm hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent className="bg-[#0d0d0d] border-[#f5f5f0]/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f5f5f0]">
              Delete this message?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#f5f5f0]/50">
              The message from {pendingDelete?.name} will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#f5f5f0]/20 text-[#f5f5f0] hover:bg-[#f5f5f0]/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MessagesPage;
