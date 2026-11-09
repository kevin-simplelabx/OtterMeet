'use client';
import Link from 'next/link';

export function Wordmark() {
  return (
    <Link href="/" className="font-sans font-extrabold text-[22px] leading-7 py-2 !text-ink no-underline">
      OtterMeet
    </Link>
  );
}
