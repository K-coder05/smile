import { screen } from "@testing-library/react";
import { renderApp } from "./test/renderApp";

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

    await app.user.click(screen.getByRole("button", { name: "Rate my smile" }));

    const preview = await screen.findByLabelText("Camera preview");
    expect(app.photoSource.attachedTo).toBe(preview);
    expect(preview).toHaveClass("mirrored");
    expect(screen.getByRole("button", { name: "Take photo" })).toBeInTheDocument();
  });

  it("captures exactly one frame and stops the camera", async () => {
    const app = renderApp();
    await app.user.click(screen.getByRole("button", { name: "Rate my smile" }));

    await app.user.click(await screen.findByRole("button", { name: "Take photo" }));

    expect(app.photoSource.captures).toBe(1);
    expect(app.photoSource.stopped).toBe(true);
    expect(screen.queryByRole("button", { name: "Take photo" })).not.toBeInTheDocument();
  });

  it("always offers an upload fallback that leads into The Twist", async () => {
    const app = renderApp();
    await app.user.click(screen.getByRole("button", { name: "Rate my smile" }));
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

      await app.user.click(screen.getByRole("button", { name: "Rate my smile" }));

      expect(await screen.findByText(/can't reach your camera/i)).toBeInTheDocument();
      expect(screen.queryByLabelText("Camera preview")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Upload a photo")).toBeInTheDocument();
    },
  );
});

const TWIST_REVEAL = "Your smile is 10/10. Don't let an LLM tell you otherwise. :)";

async function takeSelfie(app: ReturnType<typeof renderApp>) {
  await app.user.click(screen.getByRole("button", { name: "Rate my smile" }));
  await app.user.click(await screen.findByRole("button", { name: "Take photo" }));
}

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
