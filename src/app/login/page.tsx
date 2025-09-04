import { LoginForm } from '@/app/components';
import { AuthGuard } from '@/app/components';

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <main className="auth-page">
        <LoginForm />
      </main>
    </AuthGuard>
  );
}
