import { Button } from '@repo/ui/components/ui/button';
import React from 'react';
import { Icons } from '../common/icons';
import { useSearchParams } from 'next/navigation';

export default function GitHubSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
    >
      <Icons.gitHub className="mr-2 h-4 w-4" />
      GitHub
    </Button>
  );
}
