import type { LucideIcon } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/card';

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-400">{label}</p>
          <Icon size={16} className="text-brand-300" />
        </div>
        <p className="mt-2 font-mono text-2xl font-semibold text-ink-50">{value}</p>
        {trend && <p className="mt-1 text-xs text-success">{trend}</p>}
      </CardBody>
    </Card>
  );
}
