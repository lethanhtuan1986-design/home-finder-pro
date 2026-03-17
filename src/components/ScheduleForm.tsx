import { useState } from 'react';
import { Calendar, Mail, Phone, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { format, startOfDay, endOfDay } from 'date-fns';
import apartmentVisitService from '@/services/apartmentVisit.service';
import { httpRequest } from '@/services/index';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ScheduleFormProps {
  propertyTitle: string;
  apartmentUuid?: string;
  advertisementUuid?: string;
}

export const ScheduleForm = ({ propertyTitle, apartmentUuid, advertisementUuid }: ScheduleFormProps) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: undefined as Date | undefined });
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!form.date) throw new Error('No date');
      const fromDate = format(startOfDay(form.date), "yyyy-MM-dd'T'HH:mm:ss");
      const toDate = format(endOfDay(form.date), "yyyy-MM-dd'T'HH:mm:ss");

      return httpRequest({
        http: apartmentVisitService.create({
          from: fromDate,
          to: toDate,
          apartmentUuid: apartmentUuid || '',
          advertisementUuid: advertisementUuid || '',
          customerName: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
        showMessageSuccess: true,
        msgSuccess: t('schedule.success'),
        showMessageFailed: true,
      });
    },
    onSuccess: () => {
      setForm({ name: '', phone: '', email: '', date: undefined });
    },
    onError: () => {
      toast.error(t('schedule.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.name.trim() || !form.phone.trim()) return;
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <h3 className="font-semibold text-lg text-foreground">{t('schedule.title')}</h3>

      {/* Date picker - full width */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-11",
              !form.date && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {form.date ? format(form.date, 'dd/MM/yyyy') : t('schedule.date')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarUI
            mode="single"
            selected={form.date}
            onSelect={(d) => setForm(f => ({ ...f, date: d }))}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      {/* Name, Phone, Email - single row */}
      <div className="flex gap-3">
        <div className="relative flex-1 min-w-0">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('schedule.name')}
            required
            maxLength={100}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="custom-input pl-10 w-full"
          />
        </div>
        <div className="relative flex-1 min-w-0">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="tel"
            placeholder={t('schedule.phone')}
            required
            maxLength={15}
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="custom-input pl-10 w-full"
          />
        </div>
        <div className="relative flex-1 min-w-0">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            placeholder="Email"
            maxLength={255}
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="custom-input pl-10 w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {t('schedule.submit')}
      </button>
    </form>
  );
};
