import { cleanup, screen } from "@testing-library/react";
import { LOADING_LINES } from "./loadingLines";
import { renderApp } from "./test/renderApp";

type App = ReturnType<typeof renderApp>;

const TWIST_REVEAL = "Your smile is 10/10. Don't let an LLM tell you otherwise. :)";

async function openCamera(app: App) {
  await app.user.click(screen.getByRole("button", { name: "Rate my smile" }));
}

async function takeSelfie(app: App) {
  await openCamera(app);
  await app.user.click(await screen.findByRole("button", { name: "Take photo" }));
}

describe("Landing", () => {
  it("looks like a genuine AI smile rater", () => {
    renderApp();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Smile");
    expect(screen.getByRole("button", { name: "Rate my smile" })).toBeInTheDocument();
    expect(screen.getByText("Your photo never leaves your device")).toBeInTheDocument();
    expect(
      screen.getByText("Just for fun. Not a scientific or medical assessment."),
    ).toBeInTheDocument();
  });

  it("offers no way to The Real Reading and gives nothing away", () => {
    const { container } = renderApp();

    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/10\/10|LLM|actually read/i);
  });
});

describe("Camera", () => {
  it("shows a mirrored live preview from the camera and a shutter", async () => {
    const app = renderApp();

    await openCamera(app);

    const preview = await screen.findByLabelText("Camera preview");
    expect(app.photoSource.attachedTo).toBe(preview);
    expect(preview).toHaveClass("mirrored");
    expect(screen.getByRole("button", { name: "Take photo" })).toBeInTheDocument();
  });

  it("captures exactly one frame and stops the camera", async () => {
    const app = renderApp();
    await openCamera(app);

    await app.user.click(await screen.findByRole("button", { name: "Take photo" }));

    expect(app.photoSource.captures).toBe(1);
    expect(app.photoSource.stopped).toBe(true);
    expect(screen.queryByRole("button", { name: "Take photo" })).not.toBeInTheDocument();
  });

  it("lets the user press the shutter again if a capture fails", async () => {
    const app = renderApp();
    app.photoSource.failNextCapture = true;
    await openCamera(app);

    await app.user.click(await screen.findByRole("button", { name: "Take photo" }));
    expect(app.photoSource.stopped).toBe(false);
    await app.user.click(screen.getByRole("button", { name: "Take photo" }));

    expect(app.photoSource.captures).toBe(1);
    expect(screen.getByRole("img", { name: "Your photo" })).toBeInTheDocument();
  });

  it("always offers an upload fallback that leads into The Twist", async () => {
    const app = renderApp();
    await openCamera(app);
    await screen.findByRole("button", { name: "Take photo" });

    const selfie = new File(["pixels"], "selfie.jpg", { type: "image/jpeg" });
    await app.user.upload(screen.getByLabelText("Upload a photo instead"), selfie);

    expect(await screen.findByRole("img", { name: "Your photo" })).toHaveAttribute(
      "src",
      "blob:upload-selfie.jpg",
    );
    expect(app.photoSource.stopped).toBe(true);
    expect(app.photoSource.captures).toBe(0);
  });

  it.each(["denied", "unavailable"] as const)(
    "explains kindly and offers upload when the camera is %s",
    async (kind) => {
      const app = renderApp();
      app.photoSource.cameraOpening = kind;

      await openCamera(app);

      expect(await screen.findByText(/can't reach your camera/i)).toBeInTheDocument();
      expect(screen.queryByLabelText("Camera preview")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Upload a photo")).toBeInTheDocument();
    },
  );
});

describe("The Twist", () => {
  it("shows the photo while loading for about 5 s, then the Reveal", async () => {
    const app = renderApp();
    await takeSelfie(app);

    expect(screen.getByRole("img", { name: "Your photo" })).toHaveAttribute(
      "src",
      "blob:camera-frame-1",
    );
    app.advance(4999);
    expect(screen.queryByText(TWIST_REVEAL)).not.toBeInTheDocument();

    app.advance(1);
    expect(screen.getByText(TWIST_REVEAL)).toBeInTheDocument();
  });

  it("never calls the face reader, the describe client or the network", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const app = renderApp();

    await takeSelfie(app);
    app.advance(5000);

    expect(screen.getByText(TWIST_REVEAL)).toBeInTheDocument();
    expect(app.faceReader.calls).toEqual([]);
    expect(app.describeClient.calls).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe("The loading sequence", () => {
  function progress() {
    return Number(screen.getByRole("progressbar").getAttribute("aria-valuenow"));
  }

  function loadingLine() {
    return screen.getByRole("status").textContent;
  }

  it("plays a scanning line over the photo", async () => {
    const app = renderApp();
    await takeSelfie(app);

    expect(screen.getByTestId("scan-line")).toBeInTheDocument();
  });

  it("moves the progress bar unevenly: it stalls, jumps and goes backwards exactly once", async () => {
    const app = renderApp();
    await takeSelfie(app);

    const samples = [progress()];
    for (let t = 100; t < 5000; t += 100) {
      app.advance(100);
      samples.push(progress());
    }
    const steps = samples.slice(1).map((value, i) => value - samples[i]);

    expect(steps.filter((step) => step < 0)).toHaveLength(1);
    expect(Math.max(...steps)).toBeGreaterThanOrEqual(15);
    const longestStall = Math.max(
      ...samples.map((value, i) => {
        let run = 0;
        while (i + run + 1 < samples.length && samples[i + run + 1] === value) run++;
        return value > 0 && value < 100 ? run : 0;
      }),
    );
    expect(longestStall * 100).toBeGreaterThanOrEqual(600);
  });

  it("rotates a loading line about every 900 ms, never repeating within a run", async () => {
    const app = renderApp();
    await takeSelfie(app);

    const shown = [loadingLine()];
    for (let i = 0; i < 5; i++) {
      app.advance(899);
      expect(loadingLine()).toBe(shown[shown.length - 1]);
      app.advance(1);
      shown.push(loadingLine());
    }

    expect(new Set(shown).size).toBe(shown.length);
    for (const line of shown) expect(LOADING_LINES).toContain(line);
  });

  it("shows the loading lines in random order", async () => {
    const random = vi.spyOn(Math, "random");
    try {
      random.mockReturnValue(0.999);
      let app = renderApp();
      await takeSelfie(app);
      const firstRun = loadingLine();
      cleanup();

      random.mockReturnValue(0);
      app = renderApp();
      await takeSelfie(app);
      const secondRun = loadingLine();

      expect(secondRun).not.toBe(firstRun);
    } finally {
      random.mockRestore();
    }
  });

  it("celebrates The Twist's Reveal with a confetti burst", async () => {
    const app = renderApp();
    await takeSelfie(app);
    app.advance(5000);

    expect(screen.getByText(TWIST_REVEAL)).toBeInTheDocument();
    expect(screen.getByTestId("confetti")).toBeInTheDocument();
  });

  it("drops the scan animation and the confetti when the user prefers reduced motion", async () => {
    const app = renderApp({ reducedMotion: true });
    await takeSelfie(app);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByTestId("scan-line")).not.toBeInTheDocument();

    app.advance(5000);
    expect(screen.getByText(TWIST_REVEAL)).toBeInTheDocument();
    expect(screen.queryByTestId("confetti")).not.toBeInTheDocument();
  });
});
