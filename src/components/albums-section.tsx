export default function AlbumsSection() {
  return (
    <section className="albums" id="albums">
      <div className="albums__pin" id="albumsPin">
        <canvas className="albums__gl" id="glCanvas" />
        <h3 className="albums__title" id="albumTitle" aria-live="polite" />
        <div className="albums__meta">
          <span className="albums__num">
            <span className="albums__num-dash">/</span>
            <span id="albumNum">01</span>
          </span>
        </div>
      </div>
    </section>
  );
}
