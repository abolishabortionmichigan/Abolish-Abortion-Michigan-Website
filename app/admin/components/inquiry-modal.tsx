'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash } from 'lucide-react';
import { updateInquiry, deleteInquiry } from '@/lib/actions/inquiry-actions';
import { Inquiry } from '@/types';
import { formatDate } from '@/lib/utils';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  onUpdate: () => void;
}

const statusOptions = ['pending', 'responded', 'closed'];

export default function InquiryModal({ open, onClose, inquiry, onUpdate }: InquiryModalProps) {
  const [status, setStatus] = useState('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
    }
  }, [inquiry]);

  const handleStatusUpdate = async () => {
    if (!inquiry) return;

    setIsSubmitting(true);
    try {
      const res = await updateInquiry(inquiry.id, { status });
      if (!('error' in res)) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!inquiry || !confirm('Are you sure you want to delete this inquiry?')) return;

    setIsSubmitting(true);
    try {
      const res = await deleteInquiry(inquiry.id);
      if (!('error' in res)) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!inquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>Review and manage this inquiry</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md border">{inquiry.name}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md border truncate">{inquiry.email}</div>
            </div>
          </div>

          <div>
            <Label>Subject</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md border">{inquiry.subject || 'No subject'}</div>
          </div>

          <div>
            <Label>Message</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md border min-h-[100px] whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>

          <div>
            <Label>Submitted</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md border">
              {inquiry.created_at ? formatDate(inquiry.created_at) : 'N/A'}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="text-red-600 hover:bg-red-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4 mr-2" />}
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Close
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
