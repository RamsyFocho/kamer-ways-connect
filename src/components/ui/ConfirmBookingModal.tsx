import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';

interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (seatNumbers: string, busNumber: string, departureTime: string, numberOfSeats: number) => void;
  bookingId: string;
}

const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingId,
}) => {
  const [seatNumbers, setSeatNumbers] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!seatNumbers.trim() || !busNumber.trim() || !departureTime.trim() || !numberOfSeats) {
      setError('All fields are required.');
      return;
    }
    // Validate seat numbers
    const seatArr = seatNumbers.split(',').map(s => s.trim()).filter(Boolean);
    if (seatArr.length !== Number(numberOfSeats)) {
      setError(`Please enter exactly ${numberOfSeats} seat number(s), separated by commas.`);
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(seatArr.join(','), busNumber, departureTime, Number(numberOfSeats));
    } catch (err) {
      setError('Failed to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset fields when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSeatNumbers('');
      setBusNumber('');
      setDepartureTime('');
      setNumberOfSeats(1);
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
            <Label htmlFor="numberOfSeats">Number of Seats</Label>
            <Input
              id="numberOfSeats"
              type="number"
              min={1}
              value={numberOfSeats}
              onChange={e => setNumberOfSeats(Number(e.target.value))}
              placeholder="Enter number of seats"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="seatNumbers">Seat Numbers</Label>
            <Input
              id="seatNumbers"
              value={seatNumbers}
              onChange={e => setSeatNumbers(e.target.value)}
              placeholder="e.g. 1A, 1B, 2A"
              required
              disabled={isSubmitting}
            />
            <span className="text-xs text-muted-foreground">Separate seat numbers with commas</span>
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
          <div>
            <Label htmlFor="departureTime">Departure Time</Label>
            <Input
              id="departureTime"
              type="datetime-local"
              value={departureTime}
              onChange={e => setDepartureTime(e.target.value)}
              placeholder="Enter departure time (e.g. 08:00)"
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
