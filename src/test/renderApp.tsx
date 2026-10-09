import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";
import { FakeClock, FakeDescribeClient, FakeFaceReader, FakePhotoSource } from "./fakes";

/** Seam 1: renders the whole app against fake ports and drives it like a user. */
export function renderApp({ reducedMotion = false }: { reducedMotion?: boolean } = {}) {
  stubPrefersReducedMotion(reducedMotion);
  const ports = {
    photoSource: new FakePhotoSource(),
    faceReader: new FakeFaceReader(),
    describeClient: new FakeDescribeClient(),
    clock: new FakeClock(),
  };
  const user = userEvent.setup();
  const view = render(<App ports={ports} />);

  return {
    ...view,
    ...ports,
    user,
    /** Advances the fake clock inside act, so React flushes the resulting updates. */
    advance: (ms: number) => act(() => ports.clock.advance(ms)),
  };
}

/** jsdom has no matchMedia; this answers the reduced-motion query the way the user's OS would. */
function stubPrefersReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string): MediaQueryList => {
    const list = {
      matches: reduce && query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
    return list;
  });
}
