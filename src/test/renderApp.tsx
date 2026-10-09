import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";
import { FakeClock, FakeDescribeClient, FakeFaceReader, FakePhotoSource } from "./fakes";

/** Seam 1: renders the whole app against fake ports and drives it like a user. */
export function renderApp() {
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
