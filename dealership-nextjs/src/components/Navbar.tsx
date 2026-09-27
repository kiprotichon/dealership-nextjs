import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-[5%] py-4 bg-primary text-white sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-accent">Premier Motors</Link>
      <nav>
        <ul className="flex gap-6">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li><Link href="/inventory" className="hover:text-accent">Inventory</Link></li>
          <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
        </ul>
      </nav>
      <a
        href="https://wa.me/254700000000"
        target="_blank"
        rel="noreferrer"
        className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-semibold"
      >
        WhatsApp Us
      </a>
    </header>
  );
}
