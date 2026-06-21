import { Suspense } from 'react';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-24">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
