import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';

interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (seatNumber: string, busNumber: string) => void;
  bookingId: string;
}

const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingId,
}) => {
  const [seatNumber, setSeatNumber] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!seatNumber.trim() || !busNumber.trim()) {
      setError('Both fields are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(seatNumber, busNumber);
    } catch (err) {
      setError('Failed to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset fields when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSeatNumber('');
      setBusNumber('');
      setError('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="animate-in fade-in zoom-in-95">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="seatNumber">Seat Number</Label>
            <Input
              id="seatNumber"
              value={seatNumber}
              onChange={e => setSeatNumber(e.target.value)}
              placeholder="Enter seat number"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="busNumber">Bus Number</Label>
            <Input
              id="busNumber"
              value={busNumber}
              onChange={e => setBusNumber(e.target.value)}
              placeholder="Enter bus number"
              required
              disabled={isSubmitting}
            />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmBookingModal;
