import ParallelKitchen from '../components/ParallelKitchen';
import SubpageHero from '../components/SubpageHero';
import arquitecturaImg from '../assets/images/arquitectura.jpg';

export default function Seguridad() {
  return (
    <div className="w-full">
      <SubpageHero 
        title="Seguridad Alimentaria" 
        subtitle="Un foso técnico invisible. Tranquilidad absoluta para celíacos con nuestra arquitectura de cocina paralela."
        imageSrc={arquitecturaImg}
      />
      <ParallelKitchen />
    </div>
  );
}
