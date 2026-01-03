'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BreakupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  lockId: number;
}

export function BreakupDialog({ open, onOpenChange, onConfirm, lockId }: BreakupDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 text-base">
            <p>
              Vous êtes sur le point de libérer le cadenas <strong>#{lockId}</strong> et de le laisser tomber dans la Seine virtuelle.
            </p>
            <p className="text-destructive font-semibold">
              Cette action est irréversible. Le cadenas sera marqué comme "Cœur Brisé" et son emplacement redeviendra disponible pour un nouvel acheteur.
            </p>
            <p className="italic">
              Êtes-vous prêt à tourner la page et à laisser partir ce souvenir ?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            Oui, libérer le cadenas 💔
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
