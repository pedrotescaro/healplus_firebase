# 🤝 Guia de Contribuição - Heal+

Obrigado por considerar contribuir com o Heal+! Este guia irá te ajudar a entender como contribuir de forma eficaz para o projeto.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Código de Conduta](#código-de-conduta)

## 🚀 Como Contribuir

### **1. Fork e Clone**

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/healplus.git
cd healplus

# Adicione o repositório original como upstream
git remote add upstream https://github.com/ORIGINAL-OWNER/healplus.git
```

### **2. Crie uma Branch**

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch para sua feature
git checkout -b feature/nome-da-sua-feature
# ou
git checkout -b fix/descricao-do-bug
```

### **3. Faça suas Alterações**

- Siga os [padrões de código](#padrões-de-código)
- Escreva testes para novas funcionalidades
- Atualize a documentação se necessário
- Certifique-se de que o código compila

### **4. Commit e Push**

```bash
# Adicione suas alterações
git add .

# Faça commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade de análise"

# Push para sua branch
git push origin feature/nome-da-sua-feature
```

### **5. Abra um Pull Request**

1. Vá para o repositório original no GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Preencha o template do PR
5. Aguarde a revisão

## 🛠️ Configuração do Ambiente

### **Pré-requisitos**

- Node.js 18+
- npm 9+
- Git 2.30+
- Conta Firebase
- Chave API do Google Gemini

### **Instalação**

```bash
# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# Execute o projeto
npm run dev
```

### **Scripts Úteis**

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
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

### **React Components**

```typescript
// ✅ Bom: Estrutura organizada
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Component({ 
  children, 
  variant = 'primary',
  className 
}: ComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```

### **Naming Conventions**

```typescript
// ✅ Bom: Nomes descritivos
const userAnamnesisData = getAnamnesisData();
const isWoundInfected = checkInfection(woundData);

// ❌ Ruim: Nomes genéricos
const data = getData();
const flag = checkFlag();
```

### **File Structure**

```
src/
├── components/
│   ├── ui/              # Componentes reutilizáveis
│   ├── dashboard/       # Componentes específicos
│   └── auth/           # Componentes de autenticação
├── lib/                # Utilitários
├── hooks/              # Custom hooks
└── types/              # Definições de tipos
```

## 🔄 Processo de Pull Request

### **Template do PR**

```markdown
## 📋 Descrição
Breve descrição das alterações realizadas.

## 🎯 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação
- [ ] Refatoração

## 🧪 Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## 📸 Screenshots (se aplicável)
Adicione screenshots das mudanças na UI.

## ✅ Checklist
- [ ] Código compila sem erros
- [ ] Testes passam
- [ ] Linting passa
- [ ] Documentação atualizada
- [ ] Responsividade testada
```

### **Critérios de Aprovação**

- ✅ **Código compila** sem erros
- ✅ **Testes passam** (se aplicável)
- ✅ **Linting passa** sem warnings
- ✅ **Tipos** estão corretos
- ✅ **Documentação** atualizada
- ✅ **Responsividade** testada
- ✅ **Acessibilidade** considerada

## 🎯 Tipos de Contribuição

### **🐛 Bug Fixes**

1. **Identifique o bug**:
   - Reproduza o problema
   - Documente os passos
   - Verifique se já existe uma issue

2. **Crie uma issue** (se não existir):
   - Use o template de bug report
   - Adicione screenshots se aplicável
   - Inclua informações do ambiente

3. **Implemente a correção**:
   - Crie uma branch `fix/descricao-do-bug`
   - Implemente a correção
   - Adicione testes se necessário

### **✨ Novas Funcionalidades**

1. **Discuta a ideia**:
   - Abra uma issue para discussão
   - Aguarde feedback da equipe
   - Defina o escopo da funcionalidade

2. **Implemente a funcionalidade**:
   - Crie uma branch `feature/nome-da-funcionalidade`
   - Siga os padrões de código
   - Escreva testes
   - Atualize documentação

### **📚 Documentação**

1. **Identifique o que precisa**:
   - Documentação faltante
   - Exemplos confusos
   - Guias desatualizados

2. **Melhore a documentação**:
   - Crie uma branch `docs/descricao`
   - Atualize arquivos existentes
   - Adicione exemplos práticos

### **🧪 Testes**

1. **Identifique gaps de teste**:
   - Componentes sem testes
   - Funções não testadas
   - Cenários edge case

2. **Adicione testes**:
   - Crie uma branch `test/descricao`
   - Escreva testes unitários
   - Adicione testes de integração

### **🎨 UI/UX**

1. **Identifique melhorias**:
   - Problemas de usabilidade
   - Inconsistências visuais
   - Problemas de acessibilidade

2. **Implemente melhorias**:
   - Crie uma branch `ui/descricao`
   - Siga o design system
   - Teste responsividade

## 📋 Checklist de Contribuição

### **Antes de Fazer Commit**

- [ ] **Código compila** sem erros
- [ ] **Linting** passa sem warnings
- [ ] **Testes** passam (se aplicável)
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

## 🤝 Código de Conduta

### **Nossos Compromissos**

- **Respeito**: Trate todos com respeito
- **Inclusão**: Seja inclusivo e acolhedor
- **Colaboração**: Trabalhe em equipe
- **Profissionalismo**: Mantenha comportamento profissional

### **Comportamentos Esperados**

- ✅ **Seja respeitoso** e construtivo
- ✅ **Aceite críticas** de forma positiva
- ✅ **Foque no que é melhor** para a comunidade
- ✅ **Demonstre empatia** com outros membros

### **Comportamentos Inaceitáveis**

- ❌ **Linguagem ofensiva** ou comentários depreciativos
- ❌ **Trolling** ou comentários insultuosos
- ❌ **Assédio** público ou privado
- ❌ **Publicação** de informações privadas

## 🆘 Precisa de Ajuda?

### **Recursos**

- **Documentação**: [docs/README.md](docs/README.md)
- **Guia de Desenvolvimento**: [docs/development.md](docs/development.md)
- **Troubleshooting**: [docs/troubleshooting.md](docs/troubleshooting.md)

### **Contato**

- **GitHub Issues**: Para bugs e features
- **Discord**: Para discussões da comunidade
- **Email**: suporte@healplus.com

## 🙏 Agradecimentos

Obrigado por contribuir com o Heal+! Sua contribuição ajuda a melhorar o cuidado de feridas para profissionais de saúde e pacientes em todo o mundo.

---

**Juntos, estamos revolucionando o cuidado de feridas com IA! 🚀**
