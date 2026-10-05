import type { Ref, WatchSource } from 'vue';

interface Options {
  onLoadMore: () => void;
  canLoadMore: () => boolean;
  recheckOn?: WatchSource | WatchSource[];
  rootMargin?: string;
}

export function useInfiniteScroll(
  target: Ref<HTMLElement | null>,
  { onLoadMore, canLoadMore, recheckOn, rootMargin = '400px' }: Options,
) {
  let observer: IntersectionObserver | null = null;

  const recheck = () => {
    if (!observer || !target.value) return;
    observer.unobserve(target.value);
    observer.observe(target.value);
  };

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && canLoadMore()) {
          onLoadMore();
        }
      },
      { rootMargin },
    );
    recheck();
  });

  if (recheckOn) {
    watch(recheckOn, async () => {
      await nextTick();
      recheck();
    });
  }

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });

  return { recheck };
}