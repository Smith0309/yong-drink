"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">🍷</span>
          <span className="logo-text">Yong Drink</span>
        </Link>
        
        <nav className="nav">
          <Link href="/features" className="nav-link">기능</Link>
          <Link href="/about" className="nav-link">소개</Link>
          <Link href="/contact" className="nav-link">문의</Link>
        </nav>

        <div className="header-actions">
          <button className="btn-login">로그인</button>
          <button className="btn-signup">회원가입</button>
        </div>
      </div>
    </header>
  );
}
