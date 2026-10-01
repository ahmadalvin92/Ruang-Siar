import Image from 'next/image';

interface LogoMarkProps {
  className?: string;
  priority?: boolean;
  variant?: 'full' | 'mark';
}

/** Official Ruang Siar brand logo. */
export default function LogoMark({ className = '', priority = false, variant = 'full' }: LogoMarkProps) {
  if (variant === 'mark') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Image
          src="/brand/ruang-siar-mark.png"
          alt="Ruang Siar"
          width={320}
          height={242}
          priority={priority}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/brand/ruang-siar-logo.png"
        alt="Ruang Siar — Ada Untuk Anda"
        width={1024}
        height={242}
        priority={priority}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

