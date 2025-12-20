import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock, Clock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchName: string;
  price: number;
}

export const CheckoutModal = ({ isOpen, onClose, batchName, price }: CheckoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Your Purchase</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {batchName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Summary */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{price}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">One-time payment • No hidden charges</p>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
            <h3 className="font-semibold text-foreground mb-1">Payment Integration Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              We're working on integrating secure payment options. Check back soon!
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              <span>Multiple Options</span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Got it, I'll wait
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
