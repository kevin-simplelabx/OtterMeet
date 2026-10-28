/* @ds-bundle: {"format":4,"namespace":"OtterMeet","components":[{"name":"Button"},{"name":"HoldHands"},{"name":"PebbleBadge"},{"name":"AnnouncePill"},{"name":"SearchBar"},{"name":"RaftToggle"},{"name":"EventCard"},{"name":"LinkedRaft"},{"name":"TicketStub"},{"name":"TicketStack"},{"name":"KelpTimeline"},{"name":"WaveDivider"},{"name":"WaveUnderline"},{"name":"EmptyState"},{"name":"RaftConfirmation"},{"name":"PebblePouch"},{"name":"CrewNote"},{"name":"Icon"}]} */
(function () {
  'use strict';
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState;
  var useRef = React.useRef;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }
  function omit(obj, keys) {
    var out = {};
    for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && keys.indexOf(k) < 0) out[k] = obj[k];
    return out;
  }
  // controlled-or-uncontrolled state
  function useControllable(value, defaultValue, onChange) {
    var s = useState(defaultValue);
    var controlled = value !== undefined;
    var current = controlled ? value : s[0];
    function set(next) {
      if (!controlled) s[1](next);
      if (onChange) onChange(next);
    }
    return [current, set];
  }

  /* ---------- Icon: 24px rounded monoline, 2px stroke, currentColor ---------- */
  var ICONS = {
    'pin': [['path', { d: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z' }], ['circle', { cx: 12, cy: 10, r: 2.5 }]],
    'calendar': [['rect', { x: 3.5, y: 5, width: 17, height: 15.5, rx: 3 }], ['path', { d: 'M3.5 10h17M8 3v4M16 3v4' }]],
    'people': [['circle', { cx: 9, cy: 8.5, r: 3.5 }], ['path', { d: 'M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5' }], ['path', { d: 'M15.5 5.3a3.5 3.5 0 0 1 0 6.4M17.5 14.8c2 .7 3.5 2.4 4 5.2' }]],
    'arrow-right': [['path', { d: 'M4 12h15M13 6l6 6-6 6' }]],
    'pebble': [['path', { d: 'M4.5 14.3C4.5 9.7 8 6 12.8 6c4.2 0 6.9 2.4 6.9 5.7 0 4.3-3.6 7.3-8.2 7.3-4.3 0-7-1.9-7-4.7z' }]],
    'pebble-filled': [['path', { d: 'M4.5 14.3C4.5 9.7 8 6 12.8 6c4.2 0 6.9 2.4 6.9 5.7 0 4.3-3.6 7.3-8.2 7.3-4.3 0-7-1.9-7-4.7z', className: 'om-fill' }]],
    'check': [['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]],
    'compass': [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M15.5 8.5l-2 5-5 2 2-5z' }]],
    'clock': [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 7.5V12l3 2' }]],
    'wave': [['path', { d: 'M2.5 9c2 0 2.8-2 4.75-2S9.5 9 11.5 9s2.8-2 4.75-2S19 9 21.5 9M2.5 15c2 0 2.8-2 4.75-2s2.25 2 4.25 2 2.8-2 4.75-2S19 15 21.5 15' }]],
    'raft': [['circle', { cx: 9, cy: 12, r: 5 }], ['circle', { cx: 15, cy: 12, r: 5 }]],
    'search': [['circle', { cx: 11, cy: 11, r: 6.5 }], ['path', { d: 'M20 20l-4.3-4.3' }]],
    'close': [['path', { d: 'M6 6l12 12M18 6L6 18' }]],
    'cabin': [['path', { d: 'M3.5 20.5h17M6 20.5V9.5l6-5 6 5v11M10 20.5v-5h4v5' }]],
    'easel': [['rect', { x: 4, y: 4, width: 16, height: 11, rx: 2 }], ['path', { d: 'M12 15v5.5M8 20.5l2.5-5.5M16 20.5L13.5 15' }]],
    'ticket': [['path', { d: 'M4 6h16v3.5a2.5 2.5 0 0 0 0 5V18H4v-3.5a2.5 2.5 0 0 0 0-5z' }], ['path', { d: 'M14.5 7.5v1.5M14.5 11.25v1.5M14.5 15v1.5' }]]
  };
  function Icon(props) {
    var name = props.name, size = props.size || 20, label = props.label;
    var parts = ICONS[name] || [];
    var a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: 'false' };
    return h('svg', Object.assign({ className: cx('om-icon', props.className), width: size, height: size, viewBox: '0 0 24 24' }, a11y),
      parts.map(function (p, i) { return h(p[0], Object.assign({ key: i }, p[1])); }));
  }
  Icon.names = Object.keys(ICONS);

  /* ---------- Button ---------- */
  function Button(props) {
    var variant = props.variant || 'action', size = props.size || 'md';
    var rest = omit(props, ['variant', 'size', 'icon', 'iconEnd', 'block', 'className', 'children', 'href']);
    var cls = cx('om-btn', 'om-btn--' + variant, size !== 'md' && 'om-btn--' + size, props.block && 'om-btn--block', 'label', props.className);
    var kids = [
      props.icon ? h(Icon, { key: 'i', name: props.icon, size: size === 'lg' ? 20 : 18 }) : null,
      h('span', { key: 't' }, props.children),
      props.iconEnd ? h(Icon, { key: 'e', name: props.iconEnd, size: size === 'lg' ? 20 : 18 }) : null
    ];
    if (props.href) return h('a', Object.assign({ className: cls, href: props.href }, rest), kids);
    return h('button', Object.assign({ type: 'button', className: cls }, rest), kids);
  }

  /* ---------- HoldHands ---------- */
  function HoldHands(props) {
    var st = useControllable(props.held, !!props.defaultHeld, props.onChange);
    var held = st[0];
    var g = useState(false);
    var label = held ? (props.heldLabel || 'In the raft') : (props.children || 'Hold Hands');
    return h('button', {
      type: 'button',
      className: cx('om-hold', held && 'is-held', g[0] && 'is-gripping', props.className),
      'aria-pressed': held,
      onClick: function () { st[1](!held); if (!held) { g[1](false); requestAnimationFrame(function () { g[1](true); }); } },
      onAnimationEnd: function () { g[1](false); }
    },
      h('span', { className: 'om-hold__paws', 'aria-hidden': true },
        h('span', { className: 'om-hold__paw om-hold__paw--l' }),
        h('span', { className: 'om-hold__paw om-hold__paw--r' })),
      h('span', { className: 'label' }, label));
  }

  /* ---------- PebbleBadge ---------- */
  function PebbleBadge(props) {
    var tone = props.tone || 'neutral';
    return h('span', { className: cx('om-badge', 'om-badge--' + tone, 'tag', props.className) },
      props.dot ? h('span', { className: 'om-badge__dot', 'aria-hidden': true }) : null,
      props.icon ? h(Icon, { name: props.icon, size: 14 }) : null,
      props.children);
  }

  /* ---------- AnnouncePill ---------- */
  function AnnouncePill(props) {
    return h('a', { className: cx('om-announce', props.className), href: props.href || '#' },
      h('span', { className: 'om-announce__new tag' }, h(Icon, { name: 'wave', size: 16 }), props.label || 'NEW'),
      h('span', { className: 'body-sm' }, props.children),
      h(Icon, { name: 'arrow-right', size: 16 }));
  }

  /* ---------- SearchBar ---------- */
  var DEFAULT_FIELDS = [
    { name: 'where', icon: 'pin', label: 'Where', placeholder: 'Anywhere / City' },
    { name: 'dates', icon: 'calendar', label: 'Dates', placeholder: 'Add dates' },
    { name: 'team', icon: 'people', label: 'Team size', placeholder: 'How many?' }
  ];
  function SearchBar(props) {
    var fields = props.fields || DEFAULT_FIELDS;
    var vals = useState({});
    return h('form', {
      className: cx('om-search', props.className), role: 'search',
      onSubmit: function (e) { e.preventDefault(); if (props.onSubmit) props.onSubmit(vals[0]); }
    },
      fields.map(function (f) {
        return h('label', { key: f.name, className: 'om-search__field' },
          h(Icon, { name: f.icon || 'search', size: 20 }),
          h('span', { className: 'om-search__text' },
            h('span', { className: 'om-search__label eyebrow' }, f.label),
            h('input', {
              className: 'om-search__input body-sm', name: f.name, placeholder: f.placeholder, type: f.type || 'text',
              value: vals[0][f.name] || '',
              onChange: function (e) { var n = Object.assign({}, vals[0]); n[f.name] = e.target.value; vals[1](n); }
            })));
      }),
      h(Button, { type: 'submit', variant: 'action', size: 'lg', iconEnd: 'arrow-right', className: 'om-search__go' }, props.submitLabel || 'OtterGo'));
  }

  /* ---------- RaftToggle ---------- */
  var DEFAULT_MODES = [
    { value: 'offsites', icon: 'cabin', label: 'Team Offsites & Retreats' },
    { value: 'workshops', icon: 'easel', label: 'Public Workshops & Masterclasses' }
  ];
  function RaftToggle(props) {
    var options = props.options || DEFAULT_MODES;
    var st = useControllable(props.value, props.defaultValue || options[0].value, props.onChange);
    var idx = Math.max(0, options.findIndex(function (o) { return o.value === st[0]; }));
    var refs = useRef([]);
    function move(d) {
      var n = (idx + d + options.length) % options.length;
      st[1](options[n].value);
      if (refs.current[n]) refs.current[n].focus();
    }
    return h('div', {
      className: cx('om-raft-toggle', props.className), role: 'radiogroup', 'aria-label': props.label || 'Raft Mode',
      style: { '--i': idx, '--n': options.length },
      onKeyDown: function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      }
    },
      h('span', { className: 'om-raft-toggle__thumb', 'aria-hidden': true }),
      options.map(function (o, i) {
        var on = i === idx;
        return h('button', {
          key: o.value, type: 'button', role: 'radio', 'aria-checked': on, tabIndex: on ? 0 : -1,
          ref: function (el) { refs.current[i] = el; },
          className: 'om-raft-toggle__opt label',
          onClick: function () { st[1](o.value); }
        }, o.icon ? h(Icon, { name: o.icon, size: 18 }) : null, o.label);
      }));
  }

  /* ---------- LinkedRaft ---------- */
  function initials(name) {
    return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (s) { return s[0].toUpperCase(); }).join('');
  }
  function LinkedRaft(props) {
    var people = props.attendees || [];
    var max = props.max || 3;
    var shown = people.slice(0, max);
    var claimed = props.claimed != null ? props.claimed : people.length;
    var others = Math.max(0, claimed - shown.length);
    return h('div', { className: cx('om-raft', props.className) },
      props.capacity != null ? h('div', { className: 'om-raft__head meta' },
        h(Icon, { name: 'wave', size: 16 }),
        h('span', null, 'Linked Raft: ', h('b', null, claimed + '/' + props.capacity), ' spots claimed')) : null,
      h('div', { className: 'om-raft__row' },
        shown.map(function (p, i) {
          return h('span', { key: i, className: 'om-raft__avatar meta', title: p.name },
            p.src ? h('img', { src: p.src, alt: p.name }) : h('span', { 'aria-label': p.name, role: 'img' }, initials(p.name)));
        }),
        others ? h('span', { className: 'om-raft__more body-sm' }, '+' + others + ' others in the raft') : null));
  }

  /* ---------- EventCard ---------- */
  function EventCard(props) {
    var st = useControllable(props.saved, !!props.defaultSaved, props.onSaveChange);
    var saved = st[0];
    var raft = props.raft;
    return h('article', { className: cx('om-event', props.className) },
      h('div', { className: 'om-event__media' },
        props.image ? h('img', { src: props.image, alt: props.imageAlt || '' })
          : h('div', { className: 'om-event__placeholder body-sm' }, props.imageAlt || 'Event photo'),
        h('div', { className: 'om-event__chrome' },
          props.tag ? h(PebbleBadge, { tone: 'card' }, props.tag) : h('span'),
          h('button', {
            type: 'button', className: 'om-event__save tag', 'aria-pressed': saved,
            onClick: function () { st[1](!saved); }
          }, h(Icon, { name: saved ? 'pebble-filled' : 'pebble', size: 18 }), saved ? 'In your Pouch' : 'Save to Pebble'))),
      h('div', { className: 'om-event__body' },
        h('span', { className: 'om-event__eyebrow eyebrow' }, [props.dates, props.location].filter(Boolean).join(' • ')),
        h('h3', { className: 'om-event__title title' }, props.title),
        props.host ? h('p', { className: 'om-event__host body-sm' }, 'Hosted by ' + props.host) : null,
        raft ? h(LinkedRaft, Object.assign({ className: 'om-event__raft' }, raft)) : null,
        h('div', { className: 'om-event__foot' },
          h('span', { className: 'om-event__price price' }, props.price, props.priceUnit ? h('small', null, ' / ' + props.priceUnit) : null),
          h(Button, { variant: 'action', size: 'sm', onClick: props.onCta, href: props.href }, props.ctaLabel || 'Grab a Paw'))));
  }

  /* ---------- TicketStub ---------- */
  function TicketStub(props) {
    var tone = props.tone || 'action';
    var snapped = props.snapped !== false;
    return h('div', { className: cx('om-ticket', snapped && 'is-snapped', props.className), style: props.style },
      h('div', { className: 'om-ticket__main' },
        props.eyebrow ? h('span', { className: 'om-ticket__eyebrow eyebrow' }, props.eyebrow) : null,
        h('p', { className: 'om-ticket__title title' }, props.title),
        props.holder ? h('p', { className: 'om-ticket__holder body-sm' }, props.holder) : null,
        props.badge ? h('span', { className: 'om-ticket__badge' }, props.badge) : null),
      h('div', { className: cx('om-ticket__stub', 'om-ticket__stub--' + tone) },
        h('span', { className: 'eyebrow' }, props.stubLabel || 'Pass'),
        h('p', { className: 'om-ticket__code heading-3' }, props.code)));
  }
  function TicketStack(props) {
    return h('div', { className: cx('om-ticket-stack', props.className) }, props.children);
  }

  /* ---------- KelpTimeline ---------- */
  function KelpTimeline(props) {
    return h('ol', { className: cx('om-kelp', props.className) },
      (props.days || []).map(function (d, di) {
        return h('li', { key: di, className: 'om-kelp__day' },
          h('span', { className: 'om-kelp__anchor', 'aria-hidden': true }, h(Icon, { name: 'clock', size: 14 })),
          h('span', { className: 'om-kelp__daylabel eyebrow' }, d.label),
          h('ol', { className: 'om-kelp__items' },
            (d.items || []).map(function (it, ii) {
              return h('li', { key: ii, className: cx('om-kelp__item', it.status && 'is-' + it.status) },
                h('span', { className: 'om-kelp__time meta' }, it.time),
                h('div', null,
                  h('p', { className: 'om-kelp__title label' }, it.title),
                  it.detail ? h('p', { className: 'om-kelp__detail body-sm' }, it.detail) : null),
                it.status === 'now' ? h(PebbleBadge, { tone: 'accent', dot: true }, 'Now')
                  : it.badge ? h(PebbleBadge, { tone: it.badgeTone || 'neutral' }, it.badge) : h('span'));
            })));
      }));
  }

  /* ---------- WaveDivider / WaveUnderline ---------- */
  function wavePath(w, mid, amp, period) {
    var d = 'M0 ' + mid;
    for (var x = 0; x < w; x += period) {
      d += ' q' + period / 4 + ' ' + -amp + ' ' + period / 2 + ' 0 t' + period / 2 + ' 0';
    }
    return d;
  }
  function WaveDivider(props) {
    return h('svg', {
      className: cx('om-wave', props.tone === 'accent' && 'om-wave--accent', props.className),
      viewBox: '0 0 1200 24', preserveAspectRatio: 'none', role: 'separator', 'aria-hidden': true
    }, h('path', { d: wavePath(1200, 12, 7, 96) }));
  }
  function WaveUnderline(props) {
    return h('span', { className: cx('om-wave-under', props.className) },
      props.children,
      h('svg', { viewBox: '0 0 100 10', preserveAspectRatio: 'none', 'aria-hidden': true },
        h('path', { d: 'M2 6 q6 -5 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0' })));
  }

  /* ---------- EmptyState ---------- */
  function EmptyState(props) {
    return h('div', { className: cx('om-empty', props.className) },
      h('div', { className: 'om-empty__art' },
        props.illustration || h('span', { className: 'om-empty__slot meta' }, props.illustrationLabel || 'Illustration')),
      h('h3', { className: 'om-empty__title heading-3' }, props.title),
      props.children ? h('p', { className: 'om-empty__body body' }, props.children) : null,
      props.actions ? h('div', { className: 'om-empty__actions' }, props.actions) : null);
  }

  /* ---------- RaftConfirmation ---------- */
  function RaftConfirmation(props) {
    return h('section', { className: cx('om-confirm', props.className), role: 'status' },
      h('div', { className: 'om-confirm__art' },
        props.illustration || h('span', { className: 'om-confirm__rings', 'aria-hidden': true },
          h('span', { className: 'om-confirm__ring om-confirm__ring--l' }),
          h('span', { className: 'om-confirm__ring om-confirm__ring--r' }))),
      h('h2', { className: 'om-confirm__title heading-2' }, props.title || 'You’re locked into the raft.'),
      h('p', { className: 'om-confirm__body body' }, props.children || 'Check your inbox!'),
      props.pass ? h('div', { className: 'om-confirm__pass' }, props.pass) : null);
  }

  /* ---------- PebblePouch ---------- */
  function PebblePouch(props) {
    var items = props.items || [];
    return h('aside', { className: cx('om-pouch', props.className), 'aria-label': props.title || 'Your Pebble Pouch' },
      h('div', { className: 'om-pouch__head' },
        h(Icon, { name: 'pebble-filled', size: 22, className: 'om-pouch__mark' }),
        h('h2', { className: 'om-pouch__title heading-3' }, props.title || 'Your Pebble Pouch'),
        props.onClose ? h('button', { type: 'button', className: 'om-pouch__close', 'aria-label': 'Close', onClick: props.onClose }, h(Icon, { name: 'close', size: 18 })) : null),
      items.length ? h('p', { className: 'om-pouch__count meta' }, items.length === 1 ? '1 pebble saved' : items.length + ' pebbles saved') : null,
      items.length ? h('ul', { className: 'om-pouch__list' },
        items.map(function (it, i) {
          return h('li', { key: it.id || i, className: 'om-pouch__item' },
            h('div', { className: 'om-pouch__text' },
              h('p', { className: 'om-pouch__name label' }, it.title),
              it.meta ? h('p', { className: 'om-pouch__meta meta' }, it.meta) : null),
            props.onRemove ? h('button', {
              type: 'button', className: 'om-pouch__remove', 'aria-label': 'Remove ' + it.title + ' from your Pouch',
              onClick: function () { props.onRemove(it, i); }
            }, h(Icon, { name: 'close', size: 16 })) : null);
        }))
        : h('p', { className: 'om-pouch__empty body-sm' }, props.emptyText || 'Your pouch is empty. Tap Save to Pebble on any gathering to keep it here.'),
      props.footer || null);
  }

  /* ---------- CrewNote ---------- */
  var CREW = { otto: ['Otto', 'The Planner'], rue: ['Rue', 'The Host'], marlo: ['Marlo', 'The Scout'] };
  function CrewNote(props) {
    var who = CREW[props.character] || CREW.otto;
    return h('div', { className: cx('om-crew', props.className), role: props.live ? 'status' : undefined },
      h('span', { className: 'om-crew__face label', 'aria-hidden': true }, props.illustration || who[0][0]),
      h('p', { className: 'om-crew__text body-sm' },
        h('span', { className: 'om-crew__who tag' }, who[0] + ' · ' + who[1]),
        props.children));
  }

  var api = {
    Button: Button, HoldHands: HoldHands, PebbleBadge: PebbleBadge, AnnouncePill: AnnouncePill,
    SearchBar: SearchBar, RaftToggle: RaftToggle, EventCard: EventCard, LinkedRaft: LinkedRaft,
    TicketStub: TicketStub, TicketStack: TicketStack, KelpTimeline: KelpTimeline,
    WaveDivider: WaveDivider, WaveUnderline: WaveUnderline, EmptyState: EmptyState,
    RaftConfirmation: RaftConfirmation, PebblePouch: PebblePouch, CrewNote: CrewNote, Icon: Icon
  };
  window.OtterMeet = Object.assign(window.OtterMeet || {}, api);
})();
