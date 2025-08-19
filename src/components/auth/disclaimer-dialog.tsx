"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '../ui/separator';

interface DisclaimerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
}

export function DisclaimerDialog({ isOpen, onOpenChange, onAgree }: DisclaimerDialogProps) {
  const [isProfessional, setIsProfessional] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const canContinue = isProfessional && isAgreed;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Isenção de Responsabilidade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm text-muted-foreground">
            <div>
                <h3 className="font-bold text-primary mb-1">Destinado a Profissionais de Saúde</h3>
                <p>O Heal é destinado exclusivamente para uso por profissionais de saúde no curso de suas atividades profissionais, incluindo médicos, enfermeiros e assistentes médicos. Ele não foi projetado para uso pessoal ou privado.</p>
            </div>

            <div className="flex items-center space-x-2 py-2">
                <Switch id="professional-switch" checked={isProfessional} onCheckedChange={setIsProfessional} />
                <Label htmlFor="professional-switch" className="font-semibold text-foreground">Eu sou um profissional de saúde</Label>
            </div>
            
            <Separator />
            
            <div>
                <h3 className="font-bold text-primary mb-1">Uso Pretendido</h3>
                <p>O Heal auxilia os usuários a examinar feridas. No entanto, ele não se destina a diagnosticar, tratar, curar ou prevenir quaisquer doenças ou enfermidades. Ele não fornece recomendações de tratamento ou aconselhamento terapêutico. Todas as ações e decisões são de responsabilidade exclusiva do usuário.</p>
            </div>

            <div>
                <h3 className="font-bold text-primary mb-1">Dados do Paciente</h3>
                <p>O Heal processa e salva dados somente no dispositivo do usuário final. Não temos acesso a nenhum dado pessoal ou armazenamento seu ou de seus pacientes.</p>
            </div>

             <div className="flex items-center space-x-2 py-2">
                <Switch id="agree-switch" checked={isAgreed} onCheckedChange={setIsAgreed} />
                <Label htmlFor="agree-switch" className="font-semibold text-foreground">Concordo.</Label>
            </div>

        </div>
        <DialogFooter>
          <Button onClick={onAgree} disabled={!canContinue} className="w-full">
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
