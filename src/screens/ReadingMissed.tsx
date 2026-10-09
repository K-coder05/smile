/** Shown in place of a Reading when there is no face to read. Ticket 04 owns these edge cases. */
export function ReadingMissed({ message }: { message: string }) {
  return (
    <main className="screen reveal">
      <h1 className="verdict">{message}</h1>
    </main>
  );
}
