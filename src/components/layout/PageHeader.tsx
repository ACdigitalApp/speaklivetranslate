import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, backTo = '/', actions }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(backTo)} className="shrink-0">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 ml-auto mt-2 sm:mt-0">{actions}</div>}
    </div>
  );
}
