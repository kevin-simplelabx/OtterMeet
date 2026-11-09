'use client';
// Phone views for Speed Quiz, Split Words & Tribes and Imposter.
import { useState } from 'react';
import { Button } from '@/ds';
import { inputClass } from '@/components/AuthForm';
import { QUIZ_COLORS, useCountdown } from '@/hooks/useCountdown';
import { triggerHaptic } from '@/lib/haptics';
import type { Activity, ImposterPersonal, Mine, QuizPersonal, SplitPersonal } from '@/lib/types';

type Of<K extends Activity['kind']> = Extract<Activity, { kind: K }>;
type Respond = (data: Record<string, unknown>) => void;

function Card({ eyebrow, title, children }: { eyebrow: string; title?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="bg-surface-card border border-border rounded-xl shadow-card p-6 flex flex-col gap-2" aria-live="polite">
      <span className="eyebrow text-ink-muted">{eyebrow}</span>
      {title && <h1 className="heading-2 m-0">{title}</h1>}
      {children}
    </div>
  );
}

export function SpeedQuizPhone({ activity, mine, respond, rev }: { activity: Of<'SPEED_QUIZ'>; mine: Mine | null; respond: Respond; rev: number }) {
  const me = mine?.personal as QuizPersonal | undefined;
  const [tapped, setTapped] = useState<{ q: number; choice: number } | null>(null);
  const left = useCountdown(activity.remaining_ms, `${activity.index}-${rev}`);
  const answered = me?.answered ?? (tapped?.q === activity.index ? tapped.choice : null);
  const eyebrow = `Speed Quiz · ${activity.index + 1} of ${activity.total}`;

  if (activity.phase === 'leaderboard') {
    return (
      <Card eyebrow={eyebrow} title={me?.rank ? `You’re #${me.rank} of ${me.of}` : 'Leaderboard on the big screen'}>
        <p className="body-lg m-0 text-ink-muted">{me?.rank === 1 ? 'Top otter. Don’t let it go to your whiskers.' : 'Every question is a fresh splash. Stay sharp.'}</p>
        <span className="title tabular-nums">{(mine?.score ?? 0).toLocaleString()} points</span>
      </Card>
    );
  }

  if (activity.phase === 'reveal') {
    const right = activity.correct ?? 0;
    return (
      <Card eyebrow={eyebrow} title={answered === null ? 'You sat this one out.' : me?.correct ? `Right on. +${me.points}` : 'Not this time.'}>
        <p className="body-lg m-0 text-ink-muted">The answer was {activity.shapes[right]} {activity.options[right]}.</p>
      </Card>
    );
  }

  if (answered !== null && answered !== undefined) {
    return (
      <Card eyebrow={eyebrow} title="Locked in.">
        <div className={`rounded-lg p-4 text-white flex items-center gap-3 ${QUIZ_COLORS[answered]}`}>
          <span className="text-3xl" aria-hidden>{activity.shapes[answered]}</span>
          <span className="title">{activity.options[answered]}</span>
        </div>
        <p className="body m-0 text-ink-muted">Fingers crossed. Results after the buzzer.</p>
      </Card>
    );
  }

  const secs = Math.ceil(left / 1000);
  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-ink-muted">{eyebrow}</span>
        <span role="timer" className={`title tabular-nums ${secs <= 5 ? 'text-action' : 'text-ink'}`}>{secs > 0 ? `${secs}s` : 'Time’s up'}</span>
      </div>
      <p className="title m-0">{activity.prompt}</p>
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 min-h-80">
        {activity.options.map((o, i) => (
          <button key={i} type="button" disabled={secs <= 0} aria-label={`${activity.shapes[i]} ${o}`}
            onClick={() => { triggerHaptic('lock'); setTapped({ q: activity.index, choice: i }); respond({ choice: i }); }}
            className={`rounded-xl text-white flex flex-col items-center justify-center gap-2 p-3 cursor-pointer active:scale-95 transition-transform touch-manipulation disabled:opacity-40 ${QUIZ_COLORS[i]}`}>
            <span className="text-5xl leading-none" aria-hidden>{activity.shapes[i]}</span>
            <span className="body-sm text-center">{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SplitWordsPhone({ activity, mine, respond }: { activity: Of<'SPLIT_WORDS'>; mine: Mine | null; respond: Respond }) {
  const me = mine?.personal as SplitPersonal | undefined;
  const [pin, setPin] = useState('');

  if (!me?.dealt) {
    return (
      <Card eyebrow="Split Words" title="Hang tight.">
        <p className="body-lg m-0 text-ink-muted">Words are being dealt. Just arrived? Your host will slot you into a pair in a moment.</p>
      </Card>
    );
  }

  if (activity.phase === 'pairs') {
    const partners = me.partners ?? [];
    return (
      <div className="flex-1 flex flex-col gap-4">
        <span className="eyebrow text-ink-muted">Split Words · find your other half</span>
        <div className="rounded-xl bg-accent text-on-accent p-6 flex flex-col items-center gap-1 text-center shadow-float">
          <span className="eyebrow opacity-80">Your word</span>
          <span className="font-display text-5xl leading-tight">{me.word}</span>
          <span className="body-sm opacity-80">Your PIN: <strong className="tabular-nums tracking-widest">{me.pin}</strong></span>
        </div>
        {me.matched ? (
          <Card eyebrow="Matched" title={me.pair_phrase}>
            <p className="body m-0">You found {partners.map((p) => `${p.avatar} ${p.nickname}`).join(' and ')}. Now chat:</p>
            <p className="body-lg m-0 text-ink">{activity.prompt}</p>
          </Card>
        ) : (
          <>
            <p className="body m-0 text-ink-muted">
              {me.trio ? 'You’re in a trio: two other people hold words that go with yours.' : 'Someone in the room holds the other half.'} Find them, swap PINs, and type theirs here.
              {me.confirmed && partners.length ? ` Waiting for ${partners.length > 1 ? 'the rest of your trio' : 'them'} to finish up.` : ''}
            </p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (pin.length !== 4) return; triggerHaptic('tap'); respond({ pin }); setPin(''); }}>
              <input className={`${inputClass} text-center tabular-nums tracking-[0.3em] font-sans font-extrabold !text-2xl`} value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="off" placeholder="––––" maxLength={4} pattern="[0-9]*" aria-label="Your other half’s PIN" />
              <Button type="submit" variant="action" disabled={pin.length !== 4}>Match</Button>
            </form>
          </>
        )}
      </div>
    );
  }

  if (activity.phase === 'quads') {
    return (
      <Card eyebrow={`Split Words · ${me.tribe}`} title={me.quad_phrase ? 'Find your other pair.' : 'Head to your tribe.'}>
        <p className="body-lg m-0 text-ink-muted">
          {me.quad_phrase ? <>You’re <strong className="text-ink">{me.pair_phrase}</strong>. Look for the pair holding <strong className="text-ink">{me.quad_phrase}</strong>.</>
            : <>You’re <strong className="text-ink">{me.pair_phrase}</strong>, and you go straight to your tribe.</>}
        </p>
        <p className="body m-0">{activity.prompt}</p>
      </Card>
    );
  }

  return (
    <Card eyebrow="Split Words · your tribe" title={me.tribe}>
      <p className="body m-0 text-ink-muted">Gather everyone holding:</p>
      <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
        {(me.tribe_phrases ?? []).map((p) => <li key={p} className={`px-3 py-1 rounded-full body-sm ${p === me.pair_phrase ? 'bg-accent text-on-accent' : 'bg-accent-soft text-accent'}`}>{p}</li>)}
      </ul>
      <p className="body-lg m-0">{activity.prompt}</p>
    </Card>
  );
}

export function ImposterPhone({ activity, mine, respond }: { activity: Of<'IMPOSTER'>; mine: Mine | null; respond: Respond }) {
  const me = mine?.personal as ImposterPersonal | undefined;
  const [holding, setHolding] = useState(false);
  const [guess, setGuess] = useState('');
  const breathLeft = useCountdown(me?.result?.last_breath_ms, `${activity.round}-${me?.result ? 'r' : ''}`);
  const eyebrow = `Imposter · round ${activity.round + 1} of ${activity.rounds}`;

  if (!me?.seated) {
    return activity.phase === 'words'
      ? <Card eyebrow={eyebrow} title="Finding you a seat."><p className="body-lg m-0 text-ink-muted">Hang tight, your host is pulling up a chair for you at a table.</p></Card>
      : <Card eyebrow={eyebrow} title="You’re spectating this round."><p className="body-lg m-0 text-ink-muted">Enjoy the drama. You’ll be dealt in when the next round starts.</p></Card>;
  }

  // Your table, in speaking order, so you know who you're playing with and when it's your turn.
  const order = (
    <div className="bg-surface-card border border-border rounded-xl p-4 flex flex-col gap-2">
      <span className="eyebrow text-ink-muted">Your table · {me.table}</span>
      <ol className="list-none m-0 p-0 flex flex-col gap-1">
        {(me.players ?? []).map((p) => (
          <li key={p.id} className={`flex items-center gap-2 body-sm px-2 py-1 rounded-md ${p.order === me.order ? 'bg-accent-soft text-accent' : ''}`}>
            <span className="tag text-ink-muted w-5 text-right tabular-nums">{p.order}</span>
            <span aria-hidden>{p.avatar}</span>
            <span className="flex-1">{p.nickname}{p.order === me.order ? ' (you)' : ''}</span>
          </li>
        ))}
      </ol>
      <span className="body-sm text-ink-muted">Clues go in this order. You’re <strong className="text-ink">#{me.order}</strong>.</span>
    </div>
  );

  if (activity.phase === 'words') {
    const card = me.card;
    const press = (on: boolean) => { if (on) triggerHaptic('lock'); setHolding(on); };
    return (
      <div className="flex-1 flex flex-col gap-4">
        <span className="eyebrow text-ink-muted">{eyebrow}</span>
        {/* Hold-to-reveal privacy curtain: the word only shows while you press. */}
        <button type="button" onPointerDown={() => press(true)} onPointerUp={() => press(false)} onPointerLeave={() => press(false)} onPointerCancel={() => press(false)}
          onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && press(true)} onKeyUp={() => press(false)} onContextMenu={(e) => e.preventDefault()}
          aria-label="Press and hold to see your secret card"
          className={`min-h-64 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center select-none touch-none cursor-pointer transition-colors
            ${holding ? (card?.imposter ? 'bg-action text-on-action' : 'bg-accent text-on-accent') : 'bg-surface-fill text-ink'}`}>
          {holding ? (
            card?.imposter
              ? <><span className="eyebrow opacity-80">You’re the imposter</span><span className="font-display text-4xl">Blend in.</span><span className="body">The topic is <strong>{card.clue}</strong>.</span></>
              : <><span className="eyebrow opacity-80">Your secret word</span><span className="font-display text-5xl leading-tight">{card?.word}</span></>
          ) : <><span className="text-5xl" aria-hidden>🫣</span><span className="title">Press and hold to peek</span><span className="body-sm text-ink-muted">Keep it hidden from your neighbours.</span></>}
        </button>
        {order}
        <p className="body-sm m-0 text-ink-muted">Give one clue out loud when it’s your turn. Vague enough to fool the imposter, clear enough for your table.</p>
      </div>
    );
  }

  if (activity.phase === 'vote') {
    const others = (me.players ?? []).filter((p) => p.order !== me.order);
    return (
      <div className="flex-1 flex flex-col gap-4">
        <span className="eyebrow text-ink-muted">{eyebrow}</span>
        <h1 className="heading-2 m-0">Who’s the imposter?</h1>
        <div className="grid grid-cols-2 gap-3">
          {others.map((p) => {
            const on = me.vote === p.id;
            return (
              <button key={p.id} type="button" aria-pressed={on} onClick={() => { triggerHaptic('lock'); respond({ suspect_id: p.id }); }}
                className={`min-h-20 rounded-lg border-2 p-3 flex flex-col items-center gap-1 cursor-pointer touch-manipulation ${on ? 'border-action bg-action-soft' : 'border-border bg-surface-card'}`}>
                <span className="text-3xl" aria-hidden>{p.avatar}</span>
                <span className="body-sm">{p.nickname}</span>
                <span className="meta text-ink-muted">clue #{p.order}</span>
              </button>
            );
          })}
        </div>
        <p className="body m-0 text-ink-muted">{me.vote ? 'Vote in. You can change it until the reveal.' : 'Tap your suspect.'}</p>
      </div>
    );
  }

  const r = me.result;
  if (!r) return <Card eyebrow={eyebrow} title="Counting votes…" />;
  const canGuess = r.you_were_imposter && r.caught && !r.your_guess && breathLeft > 0;
  if (canGuess) {
    return (
      <Card eyebrow={`${eyebrow} · Last Breath`} title="Busted. One last splash.">
        <p className="body m-0 text-ink-muted">Guess your table’s word to steal the points. {Math.ceil(breathLeft / 1000)} seconds.</p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!guess.trim()) return; triggerHaptic('tap'); respond({ guess }); }}>
          <input className={inputClass} value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Their word" aria-label="Your guess" autoComplete="off" autoFocus />
          <Button type="submit" variant="action" disabled={!guess.trim()}>Guess</Button>
        </form>
      </Card>
    );
  }
  let title = '';
  if (r.you_were_imposter) {
    title = !r.caught ? 'You got away with it. +300' : r.your_guess?.correct ? 'Caught, but you stole it back. +300' : 'Caught. Better luck next round.';
  } else {
    title = r.caught ? 'Your table sniffed them out. +200' : 'The imposter slipped away.';
  }
  return (
    <Card eyebrow={eyebrow} title={title}>
      <p className="body-lg m-0 text-ink-muted">
        {r.imposter ? <>The imposter was {r.imposter.avatar} <strong className="text-ink">{r.imposter.nickname}</strong>. </> : null}
        The word was <strong className="text-ink">{r.word}</strong>.
      </p>
    </Card>
  );
}
