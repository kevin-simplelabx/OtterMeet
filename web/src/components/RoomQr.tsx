'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function joinUrl(code: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL ?? location.origin}/join/${code}`;
}

/** The room's one QR code, drawn dark-on-light so phone cameras read it on any projector. */
export function RoomQr({ code, size = 280 }: { code: string; size?: number }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    QRCode.toString(joinUrl(code), { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#0d1b2a', light: '#ffffff' } })
      .then(setSvg, () => setSvg(''));
  }, [code]);
  return (
    <div role="img" aria-label={`QR code to join room ${code}`} className="bg-white rounded-lg p-3 shadow-card"
      style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
