import homeBottomBorder from '../assets/home-bottom-border.png';

export function HomePage() {
  return (
    <main className="page">
      <div className="home-hero" style={{ backgroundImage: `url(${homeBottomBorder})` }}>
        <p className="home-hero__title">THE STORY<br /> WITHIN</p>
        <br/> <br/>
        <a href="/library">Begin {'->'}</a>
      </div>
    </main>
  );
}
