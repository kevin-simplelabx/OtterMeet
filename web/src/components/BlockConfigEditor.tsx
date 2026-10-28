'use client';
// Per-activity setup inside the timeline builder. Blocks left empty get sensible defaults when saved.
import { useEffect, useState } from 'react';
import { Button, RaftToggle } from '@/ds';
import { api } from '@/lib/api';
import type { SurveyQuestion, TimelineBlockItem } from '@/lib/types';
import { inputClass } from './AuthForm';
import { IconButton } from './Dialog';

type Config = Record<string, unknown>;
interface Dilemma { prompt: string; a: string; b: string }
interface BankItem { topic: string; a: string; b: string }

let bankCache: Promise<BankItem[]> | null = null;
const loadBank = () => (bankCache ??= api<{ questions: BankItem[] }>('/sessions/question_bank').then((d) => d.questions));

export function hasConfigEditor(block: TimelineBlockItem) {
  return ['THIS_OR_THAT', 'WORD_CLOUD', 'FEEDBACK', 'SPEED_QUIZ', 'SPLIT_WORDS', 'IMPOSTER'].includes(block.block_type);
}

export function BlockConfigEditor({ block, onChange }: { block: TimelineBlockItem; onChange: (config: Config) => void }) {
  if (block.block_type === 'THIS_OR_THAT') return <ThisOrThatEditor config={block.config} onChange={onChange} />;
  if (block.block_type === 'WORD_CLOUD') return <WordCloudEditor config={block.config} onChange={onChange} />;
  if (block.block_type === 'FEEDBACK') return <FeedbackEditor config={block.config} onChange={onChange} />;
  if (block.block_type === 'SPEED_QUIZ') return <SpeedQuizEditor config={block.config} onChange={onChange} />;
  if (block.block_type === 'SPLIT_WORDS') return <SplitWordsEditor config={block.config} onChange={onChange} />;
  if (block.block_type === 'IMPOSTER') return <ImposterEditor config={block.config} onChange={onChange} />;
  return null;
}

const small = `${inputClass} !min-h-9 !py-1.5`;

function ThisOrThatEditor({ config, onChange }: { config: Config; onChange: (c: Config) => void }) {
  const questions = (config.questions as Dilemma[] | undefined) ?? [];
  const majority = config.majority_rule !== false;
  const set = (qs: Dilemma[]) => onChange({ ...config, questions: qs });
  const [bank, setBank] = useState<BankItem[]>([]);
  useEffect(() => { loadBank().then(setBank, () => {}); }, []);

  const addFromBank = () => {
    const used = new Set(questions.map((q) => q.a + q.b));
    const fresh = bank.filter((b) => !used.has(b.a + b.b));
    const pick = fresh[Math.floor(Math.random() * fresh.length)];
    if (pick) set([...questions, { prompt: pick.topic, a: pick.a, b: pick.b }]);
  };

  return (
    <div className="flex flex-col gap-3">
      {questions.length === 0 && <p className="body-sm m-0 text-ink-muted">No questions yet: three spicy ones from the bank are picked when you save.</p>}
      {questions.map((q, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] gap-2 p-3 rounded-md bg-surface-fill">
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr]">
            <input className={small} aria-label={`Question ${i + 1} topic`} placeholder="Topic (optional)" value={q.prompt} maxLength={140}
              onChange={(e) => set(questions.map((x, j) => (j === i ? { ...x, prompt: e.target.value } : x)))} />
            <input className={small} aria-label={`Question ${i + 1} option A`} placeholder="This" value={q.a} maxLength={60}
              onChange={(e) => set(questions.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} />
            <input className={small} aria-label={`Question ${i + 1} option B`} placeholder="That" value={q.b} maxLength={60}
              onChange={(e) => set(questions.map((x, j) => (j === i ? { ...x, b: e.target.value } : x)))} />
          </div>
          <IconButton label={`Remove question ${i + 1}`} icon="close" onClick={() => set(questions.filter((_, j) => j !== i))} />
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="quiet" onClick={addFromBank} disabled={!bank.length}>Add a Spicy One</Button>
        <Button size="sm" variant="quiet" onClick={() => set([...questions, { prompt: '', a: '', b: '' }])}>Write My Own</Button>
        <label className="body-sm text-ink-muted flex items-center gap-2 ml-auto cursor-pointer">
          <input type="checkbox" checked={majority} onChange={(e) => onChange({ ...config, majority_rule: e.target.checked })} className="w-4 h-4" />
          Majority Rule (+100 for siding with the room)
        </label>
      </div>
    </div>
  );
}

function WordCloudEditor({ config, onChange }: { config: Config; onChange: (c: Config) => void }) {
  const mode = config.mode === 'poll' ? 'poll' : 'cloud';
  const options = (config.options as string[] | undefined) ?? ['', ''];
  return (
    <div className="flex flex-col gap-3">
      <RaftToggle label="Word cloud or poll" value={mode} options={[{ value: 'cloud', label: 'Word Cloud' }, { value: 'poll', label: 'Multiple Choice' }]}
        onChange={(v: string) => onChange({ ...config, mode: v, options: v === 'poll' && options.length < 2 ? ['', ''] : options })} />
      <input className={small} aria-label="Prompt" maxLength={140} value={(config.prompt as string) ?? ''}
        placeholder={mode === 'poll' ? 'Which session should we do next?' : 'One word for how you’re feeling right now?'}
        onChange={(e) => onChange({ ...config, prompt: e.target.value })} />
      {mode === 'poll' && (
        <div className="flex flex-col gap-2">
          {options.map((o, i) => (
            <div key={i} className="flex gap-2">
              <input className={small} aria-label={`Option ${i + 1}`} placeholder={`Option ${i + 1}`} maxLength={60} value={o}
                onChange={(e) => onChange({ ...config, options: options.map((x, j) => (j === i ? e.target.value : x)) })} />
              <IconButton label={`Remove option ${i + 1}`} icon="close" disabled={options.length <= 2}
                onClick={() => onChange({ ...config, options: options.filter((_, j) => j !== i) })} />
            </div>
          ))}
          {options.length < 6 && <div><Button size="sm" variant="quiet" onClick={() => onChange({ ...config, options: [...options, ''] })}>Add Option</Button></div>}
        </div>
      )}
    </div>
  );
}

const DEFAULT_SURVEY: SurveyQuestion[] = [
  { id: 'overall', kind: 'rating', prompt: 'How was today overall?' },
  { id: 'best', kind: 'chips', prompt: 'What worked best?', options: ['The talks', 'The games', 'Meeting people', 'Q&A'] },
  { id: 'improve', kind: 'text', prompt: 'One thing we should change next time?' },
];

function FeedbackEditor({ config, onChange }: { config: Config; onChange: (c: Config) => void }) {
  const questions = (config.questions as SurveyQuestion[] | undefined)?.length ? (config.questions as SurveyQuestion[]) : DEFAULT_SURVEY;
  const set = (qs: SurveyQuestion[]) => onChange({ ...config, questions: qs });
  const update = (i: number, patch: Partial<SurveyQuestion>) => set(questions.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <div key={q.id} className="grid grid-cols-[1fr_auto] gap-2 p-3 rounded-md bg-surface-fill">
          <div className="flex flex-col gap-2">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-[150px_1fr]">
              <select className={small} aria-label={`Question ${i + 1} type`} value={q.kind}
                onChange={(e) => update(i, { kind: e.target.value as SurveyQuestion['kind'], options: e.target.value === 'chips' ? q.options ?? ['', ''] : undefined })}>
                <option value="rating">1–5 rating</option>
                <option value="chips">Pick any</option>
                <option value="text">Comment</option>
              </select>
              <input className={small} aria-label={`Question ${i + 1}`} value={q.prompt} maxLength={140} onChange={(e) => update(i, { prompt: e.target.value })} />
            </div>
            {q.kind === 'chips' && (
              <input className={small} aria-label={`Question ${i + 1} choices`} placeholder="Choices, separated by commas"
                value={(q.options ?? []).join(', ')} onChange={(e) => update(i, { options: e.target.value.split(',').map((s) => s.trimStart()) })} />
            )}
          </div>
          <IconButton label={`Remove question ${i + 1}`} icon="close" disabled={questions.length <= 1} onClick={() => set(questions.filter((_, j) => j !== i))} />
        </div>
      ))}
      {questions.length < 6 && (
        <div><Button size="sm" variant="quiet" onClick={() => set([...questions, { id: `q${Date.now().toString(36)}`, kind: 'rating', prompt: 'How useful was this?' }])}>Add Question</Button></div>
      )}
    </div>
  );
}

interface QuizQuestion { prompt: string; options: string[]; correct: number; seconds: number }
const SHAPES = ['▲', '◆', '●', '■'];

function SpeedQuizEditor({ config, onChange }: { config: Config; onChange: (c: Config) => void }) {
  const questions = (config.questions as QuizQuestion[] | undefined) ?? [];
  const set = (qs: QuizQuestion[]) => onChange({ ...config, questions: qs });
  const update = (i: number, patch: Partial<QuizQuestion>) => set(questions.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  return (
    <div className="flex flex-col gap-3">
      {questions.length === 0 && <p className="body-sm m-0 text-ink-muted">No questions yet: three otter trivia questions are used until you write your own.</p>}
      {questions.map((q, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] gap-2 p-3 rounded-md bg-surface-fill">
          <div className="flex flex-col gap-2">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-[1fr_120px]">
              <input className={small} aria-label={`Question ${i + 1}`} placeholder="Question" maxLength={160} value={q.prompt}
                onChange={(e) => update(i, { prompt: e.target.value })} />
              <select className={small} aria-label={`Question ${i + 1} time limit`} value={q.seconds} onChange={(e) => update(i, { seconds: Number(e.target.value) })}>
                {[10, 15, 20, 30, 45, 60].map((s) => <option key={s} value={s}>{s} seconds</option>)}
              </select>
            </div>
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2" role="radiogroup" aria-label={`Question ${i + 1} answers`}>
              {q.options.map((o, k) => (
                <label key={k} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${i}`} checked={q.correct === k} onChange={() => update(i, { correct: k })} aria-label={`Answer ${k + 1} is correct`} />
                  <span aria-hidden className="w-5 text-center">{SHAPES[k]}</span>
                  <input className={small} aria-label={`Question ${i + 1} answer ${k + 1}`} placeholder={`Answer ${k + 1}`} maxLength={80} value={o}
                    onChange={(e) => update(i, { options: q.options.map((x, j) => (j === k ? e.target.value : x)) })} />
                </label>
              ))}
            </div>
          </div>
          <IconButton label={`Remove question ${i + 1}`} icon="close" onClick={() => set(questions.filter((_, j) => j !== i))} />
        </div>
      ))}
      <p className="body-sm m-0 text-ink-muted">Tick the right answer. Every question needs all four answers filled in.</p>
      <div><Button size="sm" variant="quiet" onClick={() => set([...questions, { prompt: '', options: ['', '', '', ''], correct: 0, seconds: 20 }])}>Add Question</Button></div>
    </div>
  );
}

interface PackSummary { id: string; name: string; tribes: number; sample: string[] }
let packsCache: Promise<PackSummary[]> | null = null;
const loadPacks = () => (packsCache ??= api<{ packs: PackSummary[] }>('/sessions/word_packs').then((d) => d.packs));

function PackPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [packs, setPacks] = useState<PackSummary[]>([]);
  useEffect(() => { loadPacks().then(setPacks, () => {}); }, []);
  const pack = packs.find((p) => p.id === value) ?? packs[0];
  return (
    <label className="flex flex-col gap-1.5">
      <span className="label">Word pack</span>
      <select className={small} value={pack?.id ?? value} onChange={(e) => onChange(e.target.value)}>
        {packs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {pack && <span className="body-sm text-ink-muted">{pack.tribes} tribes, like {pack.sample.join(', ')}.</span>}
    </label>
  );
}

const SPLIT_PROMPTS = ['What’s your go-to comfort supper?', 'What’s one thing you want to learn this year?', 'If your team were a TV show, what would it be called?'];

function SplitWordsEditor({ config, onChange }: { config: Config; onChange: (c: Config) => void }) {
  const prompts = (config.prompts as string[] | undefined) ?? SPLIT_PROMPTS;
  return (
    <div className="flex flex-col gap-3">
      <PackPicker value={(config.pack as string) ?? 'pack1'} onChange={(pack) => onChange({ ...config, pack, prompts })} />
      {['Pairs', 'Quads', 'Tribes'].map((label, i) => (
        <label key={label} className="flex flex-col gap-1.5">
          <span className="label">{label} chat prompt</span>
          <input className={small} maxLength={160} value={prompts[i] ?? ''} placeholder={SPLIT_PROMPTS[i]}
            onChange={(e) => onChange({ ...config, prompts: prompts.map((p, j) => (j === i ? e.target.value : p)) })} />
        </label>
      ))}
      <p className="body-sm m-0 text-ink-muted">Words are dealt to everyone in the room when you reach this block. Latecomers get slotted in with Rescue Stragglers.</p>
    </div>
  );
}

function ImposterEditor({ config, onChange }: { config: Config; onChange: (c: Config) => void }) {
  const mode = config.mode === 'chameleon' ? 'chameleon' : 'blank';
  const rounds = Number(config.rounds ?? 2);
  return (
    <div className="flex flex-col gap-3">
      <PackPicker value={(config.pack as string) ?? 'pack1'} onChange={(pack) => onChange({ ...config, pack })} />
      <div className="flex flex-col gap-1.5">
        <span className="label">The imposter gets</span>
        <RaftToggle label="Imposter card" value={mode} options={[{ value: 'blank', label: 'Just the Topic' }, { value: 'chameleon', label: 'A Similar Word' }]}
          onChange={(v: string) => onChange({ ...config, mode: v, rounds })} />
        <span className="body-sm text-ink-muted">{mode === 'blank' ? 'They know they’re the imposter and only see the topic.' : 'They get a close-but-wrong word and don’t know they’re the imposter. Sneakier.'}</span>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="label">Rounds</span>
        <select className={small} value={rounds} onChange={(e) => onChange({ ...config, mode, rounds: Number(e.target.value) })}>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'round' : 'rounds'}</option>)}
        </select>
      </label>
      <p className="body-sm m-0 text-ink-muted">Tables come from the last Split Words tribes, or groups of about six if there were none.</p>
    </div>
  );
}
