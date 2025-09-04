import { SignupForm } from '@/app/components';
import { AuthGuard } from '@/app/components';

export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false}>
      <main className="auth-page">
        <SignupForm />
      </main>
    </AuthGuard>
  );
}
