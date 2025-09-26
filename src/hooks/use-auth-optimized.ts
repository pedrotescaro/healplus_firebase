import { useCallback, useMemo } from 'react';
import { useAuth } from './use-auth';

// Hook otimizado para autenticação com memoização
export function useAuthOptimized() {
  const auth = useAuth();

  // Memoizar informações do usuário
  const userInfo = useMemo(() => {
    if (!auth.user) return null;
    
    return {
      uid: auth.user.uid,
      name: auth.user.name,
      email: auth.user.email,
      role: auth.user.role,
      photoURL: auth.user.photoURL,
    };
  }, [auth.user]);

  // Memoizar função de logout
  const logout = useCallback(async () => {
    await auth.logout();
  }, [auth.logout]);

  // Memoizar função de login
  const login = useCallback(async (email: string, password: string) => {
    return await auth.login(email, password);
  }, [auth.login]);

  // Memoizar função de registro
  const register = useCallback(async (email: string, password: string, name: string, role: string) => {
    return await auth.register(email, password, name, role);
  }, [auth.register]);

  return {
    user: userInfo,
    loading: auth.loading,
    logout,
    login,
    register,
    isAuthenticated: !!auth.user,
    isProfessional: auth.user?.role === 'professional',
    isPatient: auth.user?.role === 'patient',
  };
}
