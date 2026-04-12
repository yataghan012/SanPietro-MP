import Hero from '../components/Hero';
import OurHistory from '../components/OurHistory';
import Novedades from '../components/Novedades';
import SocialProof from '../components/SocialProof';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <OurHistory />
      <Novedades />
      <SocialProof />
    </div>
  );
}
