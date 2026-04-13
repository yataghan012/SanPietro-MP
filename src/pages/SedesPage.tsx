import FullDayEcosystem from '../components/FullDayEcosystem';
import Locations from '../components/Locations';
import SubpageHero from '../components/SubpageHero';
import LocationsMap from '../components/LocationsMap';
import TrabajaConNosotros from '../components/TrabajaConNosotros';
import fachadaImg from '../assets/images/fachada.jpg';

export default function SedesPage() {
  return (
    <div className="w-full">
      <SubpageHero 
        title="Nuestras Sedes" 
        subtitle="Dos ubicaciones, una misma alma. Descubra el ecosistema San Pietro en General Paz y Cerro de las Rosas."
        imageSrc={fachadaImg}
      />
      <FullDayEcosystem />
      <Locations />
      <LocationsMap />
      <TrabajaConNosotros />
    </div>
  );
}
