import { DottedMap } from '@/components/ui/dotted-map';
import { markers } from '@/constants/markers';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col justify-between relative w-full">
      <div className="hidden md:flex">
        <DottedMap markers={markers} />
      </div>
      <div className="w-full lg:px-4 absolute z-20 mt-2 md:mt-5 select-none">
        {children}
      </div>
    </div>
  );
}
