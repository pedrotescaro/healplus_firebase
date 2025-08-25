
export const translations = {
  "pt-br": {
    // Geral
    language: "Idioma",
    selectLanguage: "Selecione o idioma",
    fontSize: "Tamanho da Fonte",
    selectSize: "Selecione o tamanho",
    small: "Pequeno",
    medium: "Médio (Padrão)",
    large: "Grande",
    darkMode: "Modo Escuro",
    highContrast: "Alto Contraste",
    
    // Login & Signup
    welcomeBack: "Bem-vindo(a) de volta",
    loginPrompt: "Insira suas credenciais para acessar sua conta",
    password: "Senha",
    showPassword: "Mostrar senha",
    hidePassword: "Ocultar senha",
    signIn: "Entrar",
    orContinueWith: "Ou continue com",
    loginWithGoogle: "Login com Google",
    loginWithMicrosoft: "Login com Microsoft",
    dontHaveAccount: "Não tem uma conta?",
    signUp: "Cadastre-se",
    createAccount: "Crie sua Conta",
    createAccountPrompt: "Insira seus dados para começar a usar o Heal+",
    fullName: "Nome Completo",
    createAccountBtn: "Criar Conta",
    alreadyHaveAccount: "Já tem uma conta?",
    
    // Erros de Login
    loginErrorTitle: "Erro no Login",
    loginErrorDescription: "Credenciais inválidas ou e-mail não verificado.",
    loginGoogleErrorTitle: "Erro no Login com Google",
    loginGoogleErrorDescription: "Não foi possível fazer login com o Google.",
    loginMicrosoftErrorTitle: "Erro no Login com Microsoft",
    loginMicrosoftErrorDescription: "Não foi possível fazer login com a Microsoft.",
    loginPopupClosed: "A janela de login foi fechada. Por favor, tente novamente.",
    
    // Sidebar
    dashboard: "Dashboard",
    newAnamnesis: "Nova Anamnese",
    myRecords: "Minhas Fichas",
    agenda: "Agenda",
    generateReport: "Gerar Relatório",
    compareImages: "Comparar Imagens",
    profile: "Perfil",
    logout: "Sair",
  },
  "en-us": {
    // General
    language: "Language",
    selectLanguage: "Select language",
    fontSize: "Font Size",
    selectSize: "Select size",
    small: "Small",
    medium: "Medium (Default)",
    large: "Large",
    darkMode: "Dark Mode",
    highContrast: "High Contrast",

    // Login & Signup
    welcomeBack: "Welcome back",
    loginPrompt: "Enter your credentials to access your account",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signIn: "Sign In",
    orContinueWith: "Or continue with",
    loginWithGoogle: "Login with Google",
    loginWithMicrosoft: "Login with Microsoft",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    createAccount: "Create your Account",
    createAccountPrompt: "Enter your details to start using Heal+",
    fullName: "Full Name",
    createAccountBtn: "Create Account",
    alreadyHaveAccount: "Already have an account?",

    // Login Errors
    loginErrorTitle: "Login Error",
    loginErrorDescription: "Invalid credentials or email not verified.",
    loginGoogleErrorTitle: "Google Login Error",
    loginGoogleErrorDescription: "Could not log in with Google.",
    loginMicrosoftErrorTitle: "Microsoft Login Error",
    loginMicrosoftErrorDescription: "Could not log in with Microsoft.",
    loginPopupClosed: "The login window was closed. Please try again.",

    // Sidebar
    dashboard: "Dashboard",
    newAnamnesis: "New Anamnesis",
    myRecords: "My Records",
    agenda: "Agenda",
    generateReport: "Generate Report",
    compareImages: "Compare Images",
    profile: "Profile",
    logout: "Logout",
  },
};

export type Language = keyof typeof translations;
export type Translation = typeof translations['pt-br'];
export const defaultLanguage: Language = "pt-br";
