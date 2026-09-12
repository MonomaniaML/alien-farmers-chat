import { redirect } from 'next/navigation';
import { staffSupportUrl } from '@/lib/support/staff-origin';
export default function OperationsSettings(){redirect(staffSupportUrl());}
