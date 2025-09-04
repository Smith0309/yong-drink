"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const pathname = usePathname();
  const { user, logOut, loading } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">🍶</span>
          <span className="logo-text">용 드링크</span>
        </Link>
        
        <nav className="nav">
          <Link href="/features" className="nav-link">기능</Link>
          <Link href="/about" className="nav-link">소개</Link>
          <Link href="/contact" className="nav-link">문의</Link>
          {user && (
            <Link href="/analysis" className="nav-link">AI 분석</Link>
          )}
        </nav>

        <div className="header-actions">
          {loading ? (
            <div className="loading-spinner">로딩 중...</div>
          ) : user ? (
            <>
              <Link href="/dashboard" className="btn-secondary">
                대시보드
              </Link>
              <span className="user-name">
                {user.displayName || user.email}
              </span>
              <button 
                onClick={logOut} 
                className="btn-logout"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-login">
                로그인
              </Link>
              <Link href="/signup" className="btn-signup">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
