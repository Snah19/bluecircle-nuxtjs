import type { Ref } from 'vue';

export function useFeedScroll<T extends string>(active: Ref<T>) {
  const positions = new Map<T, number>();

  const switchTo = async (next: T) => {
    if (next === active.value) return;

    // save where we were in the feed we're leaving
    positions.set(active.value, window.scrollY);
    active.value = next;

    // wait for PostList to render the other feed, then restore its offset
    await nextTick();
    window.scrollTo({ top: positions.get(next) ?? 0, behavior: 'instant' });
  };

  return { switchTo };
}