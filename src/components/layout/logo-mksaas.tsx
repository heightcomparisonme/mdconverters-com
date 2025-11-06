import { cn } from '@/lib/utils';
import Image from 'next/image';

export function MDConvertersLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/MDConverters.png"
      alt="Logo of MDConverters"
      title="Logo of MDConverters"
      width={96}
      height={96}
      className={cn('size-8 rounded-md', className)}
    />
  );
}
