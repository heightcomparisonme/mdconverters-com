import { MKSaaSLogo } from '@/components/layout/logo-mksaas';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function BuiltWithButton() {
  return (
    <Link
      target="_blank"
      href="https://MDConverters.com?utm_source=built-with-MDConverters"
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'border border-border px-4 rounded-md'
      )}
    >
      <span>Built with</span>
      <span>
        <MKSaaSLogo className="size-5 rounded-full" />
      </span>
      <span className="font-semibold">MKSaaS</span>
    </Link>
  );
}
