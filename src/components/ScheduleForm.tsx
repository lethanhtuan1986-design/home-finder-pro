import { useState } from 'react';
import { Calendar, Clock, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleFormProps {
  propertyTitle: string;
}

export const ScheduleForm = ({ propertyTitle }: ScheduleFormProps) => {
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đặt lịch thành công!', {
      description: `Bạn đã đặt lịch xem "${propertyTitle}" vào ${form.date} lúc ${form.time}.`,
    });
    setForm({ name: '', phone: '', date: '', time: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Đặt lịch xem phòng</h3>
      <div className="space-y-3">
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Họ tên"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="tel"
            placeholder="Số điện thoại"
            required
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="time"
              required
              value={form.time}
              onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        Đặt lịch
      </button>
    </form>
  );
};
