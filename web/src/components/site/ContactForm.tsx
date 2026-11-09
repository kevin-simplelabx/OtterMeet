'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

const TOPICS = [
  ['team', 'Using OtterMeet with my team'],
  ['community', 'Running community events'],
  ['help', 'Help with a session or my account'],
  ['billing', 'Plans and billing'],
  ['other', 'Something else'],
];

const FIELD = 'site-field h-[52px] px-4 border-2 rounded-[14px] text-[17px]';
const LABEL = 'font-sans font-bold text-[15px]';

const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const bind = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      setError('');
    },
  });

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError('Type your name, so we know who to reply to.');
    if (!isEmail(form.email)) return setError('Type an email address like name@example.com.');
    if (!form.topic) return setError('Choose what your message is about.');
    if (form.message.trim().length < 10) return setError('Type a message of at least 10 characters.');
    setBusy(true);
    try {
      await api('/contact_messages', { method: 'POST', body: { contact_message: form } });
      setSent(true);
    } catch {
      setError('We couldn’t send that just now. Try again in a minute, or write to hello@ottermeet.io.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    const first = form.name.trim().split(/\s+/)[0] || 'there';
    return (
      <div className="flex flex-col items-start gap-3.5" role="status">
        <h2 className="site-head text-[32px] leading-[38px]">Thanks, {first}.</h2>
        <p className="m-0 text-[17px] leading-[26px] text-copy">We’ve got your message and will reply to {form.email.trim()} within 2 working days.</p>
        <button type="button" className="site-btn site-btn-ghost min-h-11 px-5 text-[15px]"
          onClick={() => { setSent(false); setForm((f) => ({ ...f, topic: '', message: '' })); }}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-[18px]" onSubmit={send} noValidate>
      <label className="flex flex-col gap-1.5"><span className={LABEL}>Your name</span>
        <input className={FIELD} type="text" autoComplete="name" {...bind('name')} /></label>
      <label className="flex flex-col gap-1.5"><span className={LABEL}>Email address</span>
        <input className={FIELD} type="email" autoComplete="email" {...bind('email')} /></label>
      <label className="flex flex-col gap-1.5"><span className={LABEL}>What’s it about?</span>
        <select className={FIELD} {...bind('topic')}>
          <option value="">Choose a topic</option>
          {TOPICS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select></label>
      <label className="flex flex-col gap-1.5"><span className={LABEL}>Message</span>
        <textarea className={`${FIELD} !h-auto min-h-[150px] py-3.5 leading-[25px] resize-y`} {...bind('message')} /></label>
      {error && <p role="alert" className="m-0 text-[15px] leading-[22px] text-[#b3261e]">{error}</p>}
      <button type="submit" disabled={busy} className="site-btn self-start min-h-[52px] px-7 text-[17px]">
        {busy ? 'Sending…' : 'Send Message'}
      </button>
      <p className="m-0 text-[13px] leading-5 text-brown">We only use your details to reply. See our <a href="/privacy">Privacy notice</a>.</p>
    </form>
  );
}
