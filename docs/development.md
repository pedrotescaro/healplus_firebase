# 💻 Guia de Desenvolvimento - Heal+

## 🎯 Visão Geral

Este guia é destinado a desenvolvedores que querem contribuir com o projeto Heal+. Aqui você encontrará informações sobre a arquitetura, padrões de código, e como configurar o ambiente de desenvolvimento.

## 🏗️ Arquitetura do Projeto

### **Estrutura de Diretórios**

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── dashboard/         # Páginas do dashboard
│   │   ├── anamnesis/     # Formulário de anamnese
│   │   ├── reports/       # Geração de relatórios
│   │   ├── compare/       # Comparação de progressões
│   │   ├── chat/          # Chat inteligente
│   │   └── profile/       # Perfil do usuário
│   ├── login/            # Página de login
│   ├── signup/           # Página de cadastro
│   └── page.tsx          # Landing page
├── components/           # Componentes React
│   ├── dashboard/        # Componentes específicos do dashboard
│   ├── ui/              # Componentes de interface reutilizáveis
│   └── auth/            # Componentes de autenticação
├── lib/                 # Utilitários e configurações
│   ├── anamnesis-schema.ts  # Schema de validação
│   ├── api-client.ts    # Cliente para APIs externas
│   └── utils.ts         # Funções utilitárias
├── hooks/               # Custom hooks
├── contexts/            # Context providers
└── firebase/            # Configuração Firebase
```

### **Padrões de Arquitetura**

#### **1. App Router (Next.js 15)**
- **Roteamento baseado em arquivos**
- **Server Components** por padrão
- **Client Components** quando necessário
- **Layouts aninhados**

#### **2. Componentes**
- **Atomic Design**: Atoms, Molecules, Organisms
- **Composição** sobre herança
- **Props tipadas** com TypeScript
- **Reutilização** máxima

#### **3. Estado Global**
- **Context API** para estado global
- **React Hook Form** para formulários
- **Zustand** para estado complexo (futuro)

## 🛠️ Configuração do Ambiente

### **Pré-requisitos**

```bash
# Node.js 18+
node --version

# npm 9+
npm --version

# Git
git --version
```

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/healplus.git
cd healplus

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves
```

### **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm run type-check   # Verificação de tipos

# Testes
npm run test         # Testes unitários
npm run test:watch   # Testes em modo watch
npm run test:coverage # Cobertura de testes

# Firebase
npm run firebase:deploy    # Deploy para Firebase
npm run firebase:rules     # Deploy apenas das regras
```

## 📝 Padrões de Código

### **TypeScript**

#### **Interfaces e Types**

```typescript
// ✅ Bom: Interface clara e específica
interface AnamnesisData {
  patientName: string;
  woundLocation: string;
  tissueType: TissueType;
  measurements: WoundMeasurements;
}

// ✅ Bom: Type union para valores específicos
type TissueType = 'granulation' | 'slough' | 'necrosis' | 'epithelization';

// ❌ Ruim: Any types
function processData(data: any): any {
  return data;
}
```

#### **Props de Componentes**

```typescript
// ✅ Bom: Props tipadas e opcionais claras
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// ✅ Bom: Componente com props tipadas
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick 
}: ButtonProps) {
  // implementação
}
```

### **React Components**

#### **Estrutura de Componente**

```typescript
// ✅ Bom: Estrutura organizada
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // props
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Event handlers
  const handleClick = () => {
    // lógica
  };
  
  // 3. Render
  return (
    <div className={cn('base-classes', prop1 && 'conditional-class')}>
      {/* JSX */}
    </div>
  );
}
```

#### **Custom Hooks**

```typescript
// ✅ Bom: Hook customizado bem estruturado
export function useAnamnesis(anamnesisId?: string) {
  const [anamnesis, setAnamnesis] = useState<AnamnesisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!anamnesisId) return;
    
    const fetchAnamnesis = async () => {
      setLoading(true);
      try {
        const data = await getAnamnesis(anamnesisId);
        setAnamnesis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchAnamnesis();
  }, [anamnesisId]);

  return { anamnesis, loading, error };
}
```

### **Styling com Tailwind**

#### **Classes Organizadas**

```typescript
// ✅ Bom: Classes organizadas e responsivas
<div className={cn(
  // Layout
  'flex flex-col items-center justify-center',
  // Spacing
  'p-4 md:p-6 lg:p-8',
  // Colors
  'bg-background text-foreground',
  // Responsive
  'w-full max-w-md md:max-w-lg lg:max-w-xl',
  // States
  'hover:bg-accent transition-colors',
  // Conditional
  isActive && 'ring-2 ring-primary'
)}>
```

#### **Variantes com cva**

```typescript
// ✅ Bom: Variantes com class-variance-authority
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

## 🔥 Firebase Integration

### **Configuração**

```typescript
// src/firebase/client-app.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // configuração
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### **Operações com Firestore**

```typescript
// ✅ Bom: Operações tipadas
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client-app';

export async function getAnamnesis(userId: string, anamnesisId: string) {
  const docRef = doc(db, 'users', userId, 'anamnesis', anamnesisId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as AnamnesisData;
  }
  
  throw new Error('Anamnese não encontrada');
}

export async function saveAnamnesis(userId: string, data: AnamnesisData) {
  const docRef = doc(db, 'users', userId, 'anamnesis');
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
```

### **Autenticação**

```typescript
// ✅ Bom: Hook de autenticação
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
```

## 🤖 AI Integration

### **Google Gemini**

```typescript
// ✅ Bom: Cliente AI tipado
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeWoundImage(imageData: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  
  const prompt = `
    Analise esta imagem de ferida e forneça:
    1. Tipo de tecido predominante
    2. Sinais de infecção
    3. Nível de cicatrização
    4. Recomendações de tratamento
  `;

  const result = await model.generateContent([prompt, imageData]);
  return result.response.text();
}
```

## 🧪 Testes

### **Estrutura de Testes**

```
__tests__/
├── components/          # Testes de componentes
├── hooks/              # Testes de hooks
├── lib/                # Testes de utilitários
└── __mocks__/          # Mocks
```

### **Exemplo de Teste**

```typescript
// ✅ Bom: Teste bem estruturado
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });
});
```

## 📦 Gerenciamento de Estado

### **Context API**

```typescript
// ✅ Bom: Context bem estruturado
interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
```

## 🚀 Deploy

### **Build para Produção**

```bash
# Build otimizado
npm run build

# Verificar build
npm run start
```

### **Deploy no Firebase**

```bash
# Deploy completo
firebase deploy

# Deploy apenas hosting
firebase deploy --only hosting

# Deploy apenas functions
firebase deploy --only functions
```

## 📋 Checklist de Desenvolvimento

### **Antes de Fazer Commit**

- [ ] **Código compila** sem erros
- [ ] **Linting** passa sem warnings
- [ ] **Testes** passam
- [ ] **Tipos** estão corretos
- [ ] **Documentação** atualizada
- [ ] **Responsividade** testada

### **Antes de Fazer PR**

- [ ] **Branch** atualizada com main
- [ ] **Commits** bem descritos
- [ ] **Testes** adicionados
- [ ] **Documentação** atualizada
- [ ] **Screenshots** (se UI)
- [ ] **Descrição** clara do PR

## 🆘 Troubleshooting

### **Problemas Comuns**

#### **Erro de Build**
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

#### **Erro de Tipos**
```bash
# Verificar tipos
npm run type-check

# Regenerar tipos
npm run generate:types
```

#### **Erro de Firebase**
```bash
# Verificar configuração
firebase projects:list
firebase use woundwise-g3zb9
```

## 📚 Recursos Adicionais

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Firebase Documentation](https://firebase.google.com/docs)**
- **[Tailwind CSS](https://tailwindcss.com/docs)**
- **[Radix UI](https://www.radix-ui.com/docs)**

---

**💻 Happy coding!**
