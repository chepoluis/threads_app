import Image from 'next/image';
import Link from 'next/link';

const Topbar = () => {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/assets/logo.svg' alt='logo' width={28} height={28}/>
        {/* max-xs:hidden: oculta el texto cuando la pantalla tiene un width menor a 400px */}
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>
          Threads
        </p>
      </Link>
    </nav>
  );
};

export default Topbar;
