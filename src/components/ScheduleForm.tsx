import { useState } from 'react';
import { Calendar, Mail, Phone, User, Loader2, AlertCircle } from 'lucide-react';
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

const VN_PHONE_REGEX = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  date?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export const ScheduleForm = ({ propertyTitle, apartmentUuid, advertisementUuid }: ScheduleFormProps) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: undefined as Date | undefined });
  const [dateOpen, setDateOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakeField, setShakeField] = useState<string | null>(null);
  const { t } = useTranslation();

  const triggerShake = (field: string) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 500);
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.date) errs.date = t('schedule.errorDate', 'Vui lòng chọn ngày xem phòng');
    if (!form.name.trim()) errs.name = t('schedule.errorName', 'Vui lòng nhập họ tên');
    if (!form.phone.trim()) {
      errs.phone = t('schedule.errorPhoneRequired', 'Vui lòng nhập số điện thoại');
    } else if (!VN_PHONE_REGEX.test(form.phone.trim())) {
      errs.phone = t('schedule.errorPhoneInvalid', 'Số điện thoại không hợp lệ (VD: 0912345678)');
    }
    if (!form.email.trim()) {
      errs.email = t('schedule.errorEmailRequired', 'Vui lòng nhập email');
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errs.email = t('schedule.errorEmail', 'Email không hợp lệ');
    }
    return errs;
  };

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
      setErrors({});
    },
    onError: () => {
      toast.error(t('schedule.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      triggerShake(firstError);
      return;
    }
    mutate();
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/60";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date picker */}
      <div className={cn(shakeField === 'date' && 'animate-shake')}>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-12 rounded-xl border-input hover:border-primary focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all",
                !form.date && "text-muted-foreground/60",
                errors.date && "border-destructive ring-1 ring-destructive"
              )}
            >
              <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
              {form.date ? format(form.date, 'dd/MM/yyyy') : t('schedule.date', 'Chọn ngày xem')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarUI
              mode="single"
              selected={form.date}
              onSelect={(d) => {
                setForm(f => ({ ...f, date: d }));
                clearError('date');
                if (d) setDateOpen(false);
              }}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-destructive text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.date}</p>}
      </div>

      {/* Name */}
      <div className={cn(shakeField === 'name' && 'animate-shake')}>
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('schedule.name')}
            maxLength={100}
            value={form.name}
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearError('name'); }}
            className={cn(inputClass, errors.name && "border-destructive ring-1 ring-destructive")}
          />
        </div>
        {errors.name && <p className="text-destructive text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
      </div>

      {/* Phone */}
      <div className={cn(shakeField === 'phone' && 'animate-shake')}>
        <div className="relative">
          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="tel"
            placeholder={t('schedule.phone')}
            maxLength={15}
            value={form.phone}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9+]/g, '');
              setForm(f => ({ ...f, phone: val }));
              clearError('phone');
            }}
            className={cn(inputClass, errors.phone && "border-destructive ring-1 ring-destructive")}
          />
        </div>
        {errors.phone && <p className="text-destructive text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
      </div>

      {/* Email */}
      <div className={cn(shakeField === 'email' && 'animate-shake')}>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            placeholder="Email"
            maxLength={255}
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); clearError('email'); }}
            className={cn(inputClass, errors.email && "border-destructive ring-1 ring-destructive")}
          />
        </div>
        {errors.email && <p className="text-destructive text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {t('schedule.submit')}
      </button>
    </form>
  );
};
