import FrictionlessMenu from '../components/FrictionlessMenu';
import SubpageHero from '../components/SubpageHero';
import ChefSuggestions from '../components/ChefSuggestions';
import cavaImg from '../assets/images/cava.jpg';

export default function MenuPage() {
  return (
    <div className="w-full">
      <SubpageHero 
        title="Nuestro Menú" 
        subtitle="Una exploración visual de nuestra herencia italiana. Ingredientes nobles y procesos cuidados en cada plato."
        imageSrc={cavaImg}
      />
      <ChefSuggestions />
      <FrictionlessMenu />
    </div>
  );
}
