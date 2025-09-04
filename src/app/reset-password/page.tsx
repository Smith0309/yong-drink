'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error);
      } else {
        setMessage('비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인해주세요.');
      }
    } catch (err) {
      setError('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">비밀번호 재설정</h2>
          <p className="auth-subtitle">
            이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          </p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary auth-button"
            >
              {loading ? '발송 중...' : '비밀번호 재설정 이메일 발송'}
            </button>
          </form>

          <div className="auth-links">
            <Link href="/login" className="auth-link">
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
