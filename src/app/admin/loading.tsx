import { Spinner } from '@presentation/components/feedback';

export default function AdminLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}
