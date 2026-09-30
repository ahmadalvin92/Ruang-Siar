import Image from 'next/image';

interface LogoMarkProps {
  className?: string;
  priority?: boolean;
}

/** Official Ruang Siar logo supplied by the owner. */
export default function LogoMark({ className = '', priority = false }: LogoMarkProps) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image
        src="/brand/ruang-siar-logo.jpeg"
        alt="Ruang Siar — Ada Untuk Anda"
        fill
        priority={priority}
        sizes="(max-width: 768px) 96px, 160px"
        className="object-contain"
      />
    </div>
  );
}
