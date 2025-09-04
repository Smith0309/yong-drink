'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="content">
        <div className="loading-container">
          <div className="loading-spinner">로딩 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="content">
      <section className="hero">
        <h1 className="heading">Yong Drink</h1>
        <p className="subtitle">AI가 함께하는 스마트한 음주 관리</p>
        <p className="description">
          개인 맞춤형 AI 가이드로 건강하고 안전한 음주 습관을 만들어보세요.
          당신의 음주 패턴을 분석하고 최적의 조언을 제공합니다.
        </p>
        <div className="cta-buttons">
          <Link href="/signup" className="btn-primary">지금 시작하기</Link>
          <Link href="/login" className="btn-secondary">로그인</Link>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">주요 기능</h2>
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">🍷</div>
            <h3>개인 맞춤 분석</h3>
            <p>
              AI가 당신의 음주 패턴을 분석하여 개인화된 음주 가이드를 제공합니다.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>음주 기록 관리</h3>
            <p>
              간편한 기록으로 음주량과 패턴을 추적하고 건강한 음주 습관을 형성하세요.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>안전 가이드</h3>
            <p>
              실시간으로 안전한 음주량을 체크하고 위험 상황을 미리 예방합니다.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>스마트 추천</h3>
            <p>
              상황에 맞는 최적의 음주 조언과 건강한 음주 문화를 제안합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">사용 방법</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>회원가입</h3>
            <p>간단한 정보 입력으로 계정을 만드세요</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>음주 기록</h3>
            <p>음주한 내용을 간편하게 기록하세요</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>AI 분석</h3>
            <p>AI가 당신의 패턴을 분석하고 조언을 제공합니다</p>
          </div>
        </div>
      </section>
    </main>
  );
}
