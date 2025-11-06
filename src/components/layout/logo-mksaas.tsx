import { cn } from '@/lib/utils';
import Image from 'next/image';

export function MKSaaSLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/mksaas.png"
      alt="Logo of MKSaaS"
      title="Logo of MKSaaS"
      width={96}
      height={96}
      className={cn('size-8 rounded-md', className)}
    />
  );
}
