import { act, cleanup, screen } from "@testing-library/react";
import type { Blendshapes, FaceScan } from "./ports/types";
import { LOADING_LINES } from "./loadingLines";
import { renderApp } from "./test/renderApp";

type App = ReturnType<typeof renderApp>;

const TWIST_REVEAL = "Your smile is 10/10. Don't let an LLM tell you otherwise. :)";

/** A face with every Blendshape at rest, apart from the ones given. */
function scanOf(moved: Partial<Blendshapes>): FaceScan {
  return {
    kind: "blendshapes",
    blendshapes: {
      mouthSmileLeft: 0,
      mouthSmileRight: 0,
      eyeSquintLeft: 0,
      eyeSquintRight: 0,
      cheekSquintLeft: 0,
      cheekSquintRight: 0,
      jawOpen: 0,
      ...moved,
    },
  };
}

/** Lets pending promises (a face read, a minimum wait) resolve and React render the outcome. */
async function settle() {
  await act(async () => {});
}

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

  it("starts loading the face model once the page is up, without reading anything", () => {
    const app = renderApp();

    expect(screen.getByRole("button", { name: "Rate my smile" })).toBeInTheDocument();
    expect(app.faceReader.preparations).toBe(1);
    expect(app.faceReader.calls).toEqual([]);
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

describe("The Real Reading", () => {
  async function reachTwistReveal(app: App) {
    await takeSelfie(app);
    app.advance(5000);
  }

  async function askForTheRealReading(app: App) {
    await app.user.click(screen.getByRole("button", { name: "Okay, but actually read my smile" }));
  }

  /** Takes a selfie whose face reads as the given Blendshapes, then waits out The Real Reading. */
  async function revealReadingFor(blendshapes: Partial<Blendshapes>) {
    const app = renderApp();
    app.faceReader.scan = scanOf(blendshapes);
    await reachTwistReveal(app);
    await askForTheRealReading(app);
    app.advance(2500);
    await settle();
    return app;
  }

  it("reads the same photo from The Twist's Reveal and reveals an Archetype", async () => {
    const app = await revealReadingFor({ mouthSmileLeft: 0.7, mouthSmileRight: 0.7, jawOpen: 0.5 });

    expect(app.faceReader.calls).toEqual([{ url: "blob:camera-frame-1" }]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Belly Laugh");
    expect(screen.getByText("Caught mid-laugh. The best kind of photo.")).toBeInTheDocument();
  });

  it("keeps the loading sequence up for at least 2.5 s, even when the face is read at once", async () => {
    const app = renderApp();
    app.faceReader.scan = scanOf({ mouthSmileLeft: 0.7, mouthSmileRight: 0.7, jawOpen: 0.5 });
    await reachTwistReveal(app);

    await askForTheRealReading(app);
    app.advance(2499);
    await settle();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("The Belly Laugh")).not.toBeInTheDocument();

    app.advance(1);
    await settle();
    expect(screen.getByText("The Belly Laugh")).toBeInTheDocument();
  });

  // Blendshapes picked by hand against the spec's Feature formulas and Archetype rules.
  it.each<{ smile: string; blendshapes: Partial<Blendshapes>; archetype: string; tagline: string }>([
    {
      smile: "a barely-there smile",
      blendshapes: { mouthSmileLeft: 0.1, mouthSmileRight: 0.1 },
      archetype: "The Mona Lisa",
      tagline: "Barely there, and everyone wants to know what you're thinking.",
    },
    {
      smile: "a barely-there smile with one corner up (symmetry counts as even)",
      blendshapes: { mouthSmileLeft: 0.2, mouthSmileRight: 0 },
      archetype: "The Mona Lisa",
      tagline: "Barely there, and everyone wants to know what you're thinking.",
    },
    {
      smile: "a lopsided smile",
      blendshapes: { mouthSmileLeft: 0.6, mouthSmileRight: 0.3 },
      archetype: "The Mischief",
      tagline: "One corner got there first. You're up to something.",
    },
    {
      smile: "a big open-mouthed smile",
      blendshapes: { mouthSmileLeft: 0.7, mouthSmileRight: 0.7, eyeSquintLeft: 0.8, eyeSquintRight: 0.8, jawOpen: 0.5 },
      archetype: "The Belly Laugh",
      tagline: "Caught mid-laugh. The best kind of photo.",
    },
    {
      smile: "a big smile with crinkled eyes",
      blendshapes: { mouthSmileLeft: 0.7, mouthSmileRight: 0.7, eyeSquintLeft: 0.8, eyeSquintRight: 0.8 },
      archetype: "The Sunrise",
      tagline: "The whole face is in on it.",
    },
    {
      smile: "a big smile whose eye involvement rounds up to the threshold",
      blendshapes: { mouthSmileLeft: 0.7, mouthSmileRight: 0.7, eyeSquintLeft: 0.624, eyeSquintRight: 0.624 },
      archetype: "The Sunrise",
      tagline: "The whole face is in on it.",
    },
    {
      smile: "a small smile with crinkled eyes",
      blendshapes: {
        mouthSmileLeft: 0.3,
        mouthSmileRight: 0.3,
        eyeSquintLeft: 0.7,
        eyeSquintRight: 0.7,
        cheekSquintLeft: 0.2,
        cheekSquintRight: 0.2,
      },
      archetype: "The Smize",
      tagline: "The mouth is calm. The eyes are telling the joke.",
    },
    {
      smile: "a big smile with calm eyes",
      blendshapes: { mouthSmileLeft: 0.7, mouthSmileRight: 0.7, jawOpen: 0.2 },
      archetype: "The Red Carpet",
      tagline: "Polished, confident, camera-ready.",
    },
    {
      smile: "a medium smile with the eyes joining in",
      blendshapes: { mouthSmileLeft: 0.5, mouthSmileRight: 0.5, eyeSquintLeft: 0.5, eyeSquintRight: 0.5 },
      archetype: "The Just-Heard-Good-News",
      tagline: "Something nice just happened and it shows.",
    },
    {
      smile: "a small, soft smile",
      blendshapes: { mouthSmileLeft: 0.3, mouthSmileRight: 0.3 },
      archetype: "The Quiet Glow",
      tagline: "Soft, easy, the kind people feel relaxed around.",
    },
  ])(
    "reveals $archetype for $smile, with its Tagline and a Fallback Description",
    async ({ blendshapes, archetype, tagline }) => {
      await revealReadingFor(blendshapes);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(archetype);
      // Reads top to bottom as the Archetype name, then the Tagline, then the Description.
      const reveal = screen.getByRole("main").textContent ?? "";
      expect(reveal.startsWith(archetype + tagline)).toBe(true);
      const description = reveal.slice((archetype + tagline).length);
      const sentences = description.split(/[.!?](?:\s|$)/).filter(Boolean);
      expect(sentences.length).toBeGreaterThanOrEqual(2);
      expect(sentences.length).toBeLessThanOrEqual(3);
      expect(description).not.toMatch(
        /\d|%|score|rank|grade|better|best|worse|improve|teeth|skin|\bage\b|gender|weight|attractive|fake|forced|weak/i,
      );
    },
  );

  it("touches the photo only through the face reader: nothing is described or sent", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const app = await revealReadingFor({ mouthSmileLeft: 0.3, mouthSmileRight: 0.3 });

    expect(screen.getByText("The Quiet Glow")).toBeInTheDocument();
    expect(app.describeClient.calls).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
