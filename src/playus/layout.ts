/** Supplies responsive CSS lengths without making the element a size container. */
export function observeLayoutSize(element: HTMLElement): () => void {
  const update = (width: number, height: number) => {
    element.style.setProperty('--game-width-unit', `${width / 100}px`);
    element.style.setProperty('--game-height-unit', `${height / 100}px`);
  };
  const style = getComputedStyle(element);
  update(
    element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
  );
  const observer = new ResizeObserver(([entry]) => {
    if (entry) update(entry.contentRect.width, entry.contentRect.height);
  });
  observer.observe(element);
  const onPageHide = (event: PageTransitionEvent) => {
    if (!event.persisted) stop();
  };
  const stop = () => {
    observer.disconnect();
    window.removeEventListener('pagehide', onPageHide);
  };
  window.addEventListener('pagehide', onPageHide);
  return stop;
}
