import { ProtectedRoute } from '@/app/components';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="dashboard">
        <div className="dashboard-container">
          <h1 className="dashboard-title">대시보드</h1>
          <p className="dashboard-subtitle">
            안녕하세요! Yong Drink와 함께 건강한 음주 습관을 만들어보세요.
          </p>
          
          <div className="dashboard-content">
            <div className="dashboard-card">
              <h3>음주 기록</h3>
              <p>오늘의 음주 기록을 추가해보세요.</p>
              <button className="btn-primary">기록 추가</button>
            </div>
            
            <div className="dashboard-card">
              <h3>AI 분석</h3>
              <p>당신의 음주 패턴을 분석해보세요.</p>
              <button className="btn-secondary">분석 보기</button>
            </div>
            
            <div className="dashboard-card">
              <h3>안전 가이드</h3>
              <p>현재 상태에 맞는 안전 가이드를 확인하세요.</p>
              <button className="btn-secondary">가이드 보기</button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
