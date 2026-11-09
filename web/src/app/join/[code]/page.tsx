'use client';
// Mobile participant controller (spec 9.7). No app, no account: a nickname, an avatar, and a token kept in
// localStorage so a locked screen or dropped connection rejoins as the same person.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, EmptyState } from '@/ds';
import { Alert, Field, inputClass } from '@/components/AuthForm';
import { Wordmark } from '@/components/SiteHeader';
import { GroupPicker, groupLabel } from '@/components/GroupsEditor';
import { Dialog } from '@/components/Dialog';
import { ApiError, api } from '@/lib/api';
import { BLOCK_TYPES } from '@/lib/blocks';
import { triggerHaptic } from '@/lib/haptics';
import { useLiveRoom, type RoomEvent } from '@/lib/live';
import { EmojiShower, type EmojiShowerHandle } from '@/components/stage/EmojiShower';
import { ImposterPhone, SpeedQuizPhone, SplitWordsPhone } from '@/components/mobile/PartyPhones';
import { FeedbackPhone, FeedbackToast, QnaPhone, ThisOrThatPhone, WordCloudPhone } from '@/components/mobile/GamePhones';
import { REACTIONS, type Group, type Participant, type StageState } from '@/lib/types';

const tokenKey = (code: string) => `ottermeet:pt:${code}`;
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch {} },
};

export default function JoinRoom() {
  const code = useParams<{ code: string }>().code.toUpperCase();
  const [phase, setPhase] = useState<'loading' | 'form' | 'joined' | 'missing'>('loading');
  const [room, setRoom] = useState<StageState | null>(null);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [changingTable, setChangingTable] = useState(false);
  const [me, setMe] = useState<Participant | null>(null);
  const [token, setToken] = useState<string | undefined>();

  // Only a definite "not found" forgets a saved token. Network blips and a restarting server just retry, so a
  // phone keeps its identity (and its pair, team and points) through a hiccup.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const retry = (fn: () => void) => { timer = setTimeout(() => !cancelled && fn(), 2000); };
    const isMissing = (e: unknown) => e instanceof ApiError && e.status === 404;

    const fresh = () => api<{ room: StageState; avatars: string[]; groups: Group[] }>(`/join/${code}`).then((d) => {
      if (!cancelled) { setRoom(d.room); setAvatars(d.avatars); setGroups(d.groups ?? []); setPhase('form'); }
    }, (e) => (isMissing(e) ? !cancelled && setPhase('missing') : retry(fresh)));

    const rejoin = (saved: string) => api<{ participant: Participant; room: StageState; groups: Group[] }>(`/join/${code}/me`, { headers: { 'X-Participant-Token': saved } }).then((d) => {
      if (!cancelled) { setMe(d.participant); setRoom(d.room); setGroups(d.groups ?? []); setToken(saved); setPhase('joined'); }
    }, (e) => {
      if (!isMissing(e)) return retry(() => rejoin(saved));
      store.del(tokenKey(code));
      fresh();
    });

    const saved = store.get(tokenKey(code));
    if (saved) rejoin(saved); else fresh();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [code]);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between gap-3 border-b border-border">
        <Wordmark />
        {me && (
          <span className="body-sm inline-flex items-center gap-2 min-w-0">
            {groups.length > 0 && (
              <button type="button" onClick={() => setChangingTable(true)} className="tag px-3 py-1 rounded-full bg-accent-soft text-accent cursor-pointer whitespace-nowrap">
                {groupLabel(groups, me.group) ?? 'Pick your table'}
              </button>
            )}
            <span className="text-2xl" aria-hidden>{me.avatar}</span><span className="truncate">{me.nickname}</span>
          </span>
        )}
      </header>
      <main className="flex-1 flex flex-col px-4 py-6 max-w-[480px] w-full mx-auto">
        {phase === 'loading' && <p className="body text-ink-muted">Looking for room {code}…</p>}
        {phase === 'missing' && (
          <EmptyState title={`We can’t find room ${code}.`} actions={<Button variant="quiet" href="/join">Try Another Code</Button>}>
            Double-check the code on the big screen and try again.
          </EmptyState>
        )}
        {phase === 'form' && room && (
          <JoinForm code={code} room={room} avatars={avatars} groups={groups} onJoined={(p, t) => {
            store.set(tokenKey(code), t); setMe(p); setToken(t); setPhase('joined'); triggerHaptic('success');
          }} />
        )}
        {phase === 'joined' && me && token && <InRoom code={code} token={token} initial={room} />}
        {changingTable && me && token && (
          <Dialog title="Change your table" size="sm" onClose={() => setChangingTable(false)}>
            <GroupPicker groups={groups} value={me.group ?? null} onChange={async (group) => {
              const d = await api<{ participant: Participant }>(`/join/${code}/me`, { method: 'PATCH', headers: { 'X-Participant-Token': token }, body: { group } }).catch(() => null);
              if (d) { setMe(d.participant); triggerHaptic('tap'); }
              setChangingTable(false);
            }} />
            <p className="body-sm m-0 text-ink-muted">Games that play in groups use your new table from their next round.</p>
          </Dialog>
        )}
      </main>
    </div>
  );
}

function JoinForm({ code, room, avatars, groups, onJoined }: { code: string; room: StageState; avatars: string[]; groups: Group[]; onJoined: (p: Participant, token: string) => void }) {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(avatars[0] ?? '🦦');
  const [group, setGroup] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const d = await api<{ participant: Participant; token: string }>(`/join/${code}`, { method: 'POST', body: { nickname, avatar, group } });
      onJoined(d.participant, d.token);
    } catch (err) {
      setError((err as Error).message); setBusy(false); triggerHaptic('error');
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
      <div className="flex flex-col gap-2">
        <span className="eyebrow text-ink-muted">Room {code}</span>
        <h1 className="heading-2 m-0">{room.title}</h1>
        <p className="body m-0 text-ink-muted">Pick a name and an avatar, then dive in. No app, no sign-up.</p>
      </div>
      {error && <Alert>{error}</Alert>}
      {room.status !== 'LIVE' && !error && <Alert>The river isn’t open yet. Hang tight and try again when your host says go.</Alert>}
      <Field label="Your nickname">
        <input className={inputClass} value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={24} autoComplete="nickname" placeholder="Sam K." />
      </Field>
      <fieldset className="border-0 p-0 m-0 flex flex-col gap-2">
        <legend className="label mb-2">Your avatar</legend>
        <div className="grid grid-cols-8 max-[360px]:grid-cols-6 gap-2">
          {avatars.map((a) => (
            <button key={a} type="button" aria-pressed={a === avatar} aria-label={`Avatar ${a}`} onClick={() => { setAvatar(a); triggerHaptic('tap'); }}
              className={`aspect-square text-2xl rounded-md border cursor-pointer ${a === avatar ? 'border-accent bg-accent-soft' : 'border-border bg-surface-card'}`}>
              {a}
            </button>
          ))}
        </div>
      </fieldset>
      {groups.length > 0 && <GroupPicker groups={groups} value={group} onChange={(g) => { setGroup(g); triggerHaptic('tap'); }} />}
      <Button type="submit" variant="action" size="lg" block disabled={busy || !nickname.trim()}>{busy ? 'Joining…' : 'Join Room'}</Button>
    </form>
  );
}

function InRoom({ code, token, initial }: { code: string; token: string; initial: StageState | null }) {
  const [toast, setToast] = useState<{ block_id: string; title: string; tags: string[] } | null>(null);
  const [notice, setNotice] = useState('');
  const onEvent = useCallback((e: RoomEvent) => {
    if (e.event === 'FEEDBACK_PROMPT') setToast(e);
    else if (e.event === 'ERROR') { setNotice(e.message); triggerHaptic('error'); }
    else if (e.event === 'QNA_ASKED') { setNotice('Sent. Your question is swimming over to the host.'); triggerHaptic('success'); }
  }, []);
  const { state, connected, perform, mine, qna, upvoted } = useLiveRoom(code, { role: 'participant', participantToken: token, initial, onEvent });
  const last = useRef(0);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // Client-side throttle matches the server's 6 per second.
  const shower = useRef<EmojiShowerHandle>(null);

  // The tap also floats up on your own screen, from the button you pressed.
  const react = (emoji: string, button: HTMLElement) => {
    const now = performance.now();
    if (now - last.current < 1000 / 6) return;
    last.current = now;
    triggerHaptic('tap');
    perform('send_reaction', { emoji });
    const r = button.getBoundingClientRect();
    const x = ((r.left + r.width / 2) / window.innerWidth) * 100;
    shower.current?.burst([{ emoji, x_percent: x, timestamp: Date.now() / 1000 }]);
  };

  if (!state) return <p className="body text-ink-muted">Dipping in…</p>;

  if (state.status === 'COMPLETED') {
    return <EmptyState title="That’s a wrap.">Thanks for swimming with us at {state.title}. You can close this page.</EmptyState>;
  }

  const block = state.block;
  const live = state.status === 'LIVE';
  const dark = state.blackout || block?.block_type === 'BLACKOUT';
  const activity = live && !dark ? state.activity : null;
  const myAnswers = mine && mine.block_id === block?.id ? mine : null;
  const respond = (data: Record<string, unknown>) => perform('respond', { block_id: block?.id, ...data });
  const ask = (content: string, anonymous: boolean) => perform('ask_qna', { content, anonymous });
  const upvote = (id: string) => perform('upvote_qna', { question_id: id });

  let game: React.ReactNode = null;
  if (activity?.kind === 'THIS_OR_THAT') game = <ThisOrThatPhone activity={activity} mine={myAnswers} respond={respond} />;
  else if (activity?.kind === 'WORD_CLOUD') game = <WordCloudPhone activity={activity} mine={myAnswers} respond={respond} />;
  else if (activity?.kind === 'FEEDBACK') game = <FeedbackPhone activity={activity} mine={myAnswers} respond={respond} />;
  else if (activity?.kind === 'SPEED_QUIZ') game = <SpeedQuizPhone activity={activity} mine={myAnswers} respond={respond} rev={state.rev} />;
  else if (activity?.kind === 'SPLIT_WORDS') game = <SplitWordsPhone activity={activity} mine={myAnswers} respond={respond} />;
  else if (activity?.kind === 'IMPOSTER') game = <ImposterPhone activity={activity} mine={myAnswers} respond={respond} />;
  else if (activity?.kind === 'QNA') game = <QnaPhone qna={qna} upvoted={upvoted} ask={ask} upvote={upvote} />;

  let headline = 'Pop your head up and watch the big screen.';
  if (!live) headline = 'Your host is about to start. Get comfy.';
  else if (dark) headline = 'Float on your back and enjoy the talk. We’ll be right here when it’s game time.';
  else if (block?.block_type === 'LOBBY') headline = 'You’re in the raft. We’ll start soon.';
  else if (block?.block_type === 'BREAK') headline = 'Break time. Stretch your paws and grab a snack.';
  else if (block?.block_type === 'HOLDING') headline = 'Got a question for the speaker? Ask it below.';
  else if (block && !BLOCK_TYPES[block.block_type].ready) headline = 'Get ready, a game is about to splash down.';

  return (
    <div className="flex-1 flex flex-col gap-6 pb-4">
      {!connected && <p role="status" className="body-sm m-0 text-ink-muted">Paddling back online…</p>}
      {toast && (
        <FeedbackToast title={toast.title} tags={toast.tags} onClose={closeToast}
          onSend={(rating, tag) => perform('submit_feedback', { block_id: toast.block_id, rating, tag })} />
      )}
      {notice && <p role="status" className="body-sm m-0 px-4 py-3 rounded-md bg-accent-soft text-ink">{notice}</p>}
      {(mine?.score ?? 0) > 0 && <span className="tag text-ink-muted self-end tabular-nums">{mine!.score} points</span>}

      {game ?? (
        <div className="bg-surface-card border border-border rounded-xl shadow-card p-6 flex flex-col gap-2" aria-live="polite">
          <span className="eyebrow text-ink-muted">{state.title}{block && !dark ? ` · ${BLOCK_TYPES[block.block_type].label}` : ''}</span>
          {block && !dark && live && <h1 className="heading-2 m-0">{block.title}</h1>}
          <p className="body-lg m-0 text-ink-muted">{headline}</p>
        </div>
      )}

      {live && !dark && block?.block_type === 'HOLDING' && <QnaPhone qna={qna} upvoted={upvoted} ask={ask} upvote={upvote} askOnly />}

      {state.allow_emoji_shower && live && !game && (
        <div className="mt-auto flex flex-col gap-3">
          <span className="label text-center text-ink-muted">Send a reaction to the big screen</span>
          <div className="grid grid-cols-5 gap-2">
            {REACTIONS.map((e) => (
              <button key={e} type="button" aria-label={`React ${e}`} onClick={(ev) => react(e, ev.currentTarget)}
                className="aspect-square text-4xl rounded-lg bg-surface-card border border-border shadow-card active:scale-90 transition-transform cursor-pointer select-none touch-manipulation">
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.allow_emoji_shower && live && !game && (
        <div className="fixed inset-0 z-30 pointer-events-none"><EmojiShower ref={shower} /></div>
      )}

    </div>
  );
}
