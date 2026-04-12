import VerificationBooking from '../components/VerificationBooking';
import SubpageHero from '../components/SubpageHero';
import GiftVouchers from '../components/GiftVouchers';

export default function ReservasPage() {
  return (
    <div className="w-full bg-[#F5F2ED]">
      <SubpageHero 
        title="Reserve su Mesa" 
        subtitle="Asegure su lugar. Un proceso de reserva inteligente diseñado para garantizar su experiencia y seguridad."
        imageSrc="/salon.jpg"
      />
      <VerificationBooking />
      <GiftVouchers />
    </div>
  );
}
