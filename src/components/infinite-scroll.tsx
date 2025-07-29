import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

type Props = {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    rootMargin: '100px',
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isManual,
  ]);

  return (
    <div className="flex flex-col items-center">
      <div className="h-1" ref={targetRef} />
      {hasNextPage ? (
        <Button
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={fetchNextPage}
          variant="link"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </Button>
      ) : (
        <p className="text-muted-foreground text-xs">
          You have reached the end of the list
        </p>
      )}
    </div>
  );
};
