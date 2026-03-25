import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types/auth';

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' },
  user_pro: { label: 'User Pro', className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' },
  user: { label: 'User', className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100' },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const config = roleConfig[role];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
