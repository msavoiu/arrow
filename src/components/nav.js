'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Nav() {
  const isLoggedIn = true;

  return (
    <nav className="flex-betwen w-full mb-16 pt-3">
      <Link href="/">
        <p>Home</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:hidden flex relative">
        {isLoggedIn ? (
          <div className="flex">
            <Image src="../assets/user_icon.svg" width="50" height="50"/>
          </div>
        ) : (
          <div>You ain't logged in</div>
        )}
      </div>
    </nav>
  );
}
