import { useState } from 'react';
import { Calendar, Clock, Mail, Phone, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import apartmentVisitService from '@/services/apartmentVisit.service';
import { httpRequest } from '@/services/index';

interface ScheduleFormProps {
  propertyTitle: string;
  apartmentUuid?: string;
  advertisementUuid?: string;
}

export const ScheduleForm = ({ propertyTitle, apartmentUuid, advertisementUuid }: ScheduleFormProps) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '' });
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const fromDate = `${form.date}T${form.time || '08:00'}:00`;
      const toDate = `${form.date}T${form.time ? `${String(Number(form.time.split(':')[0]) + 1).padStart(2, '0')}:${form.time.split(':')[1]}` : '09:00'}:00`;

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
      setForm({ name: '', phone: '', email: '', date: '', time: '' });
    },
    onError: () => {
      toast.error(t('schedule.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.date) return;
    mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <h3 className="font-semibold text-lg text-foreground">{t('schedule.title')}</h3>
      <div className="space-y-3">
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('schedule.name')}
            required
            maxLength={100}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="custom-input pl-10"
          />
        </div>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="tel"
            placeholder={t('schedule.phone')}
            required
            maxLength={15}
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="custom-input pl-10"
          />
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            placeholder="Email"
            maxLength={255}
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="custom-input pl-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              required
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="custom-input pl-10"
            />
          </div>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="time"
              required
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              className="custom-input pl-10"
            />
          </div>
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
