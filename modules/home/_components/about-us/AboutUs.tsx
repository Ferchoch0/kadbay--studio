'use client';

import Image from 'next/image';
import { BsDiamondFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import aboutusTitle from '@/assets/images/aboutus-title.png';
import aboutusImage from '@/assets/images/aboutus-image.png';
import { Business } from '@/services/business.service';

interface AboutUsProps {
  business: Business | null;
}

export default function AboutUs({ business }: AboutUsProps) {
  const description = business?.description || 'En Kad Bay Studio creemos que la belleza no es solo un resultado, sino un ritual. Hemos creado un espacio donde el lujo sereno y la atención meticulosa se encuentran para ofrecerte una experiencia verdaderamente transformadora.';

  return (
    <section id="nosotros" className="py-10 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#F4ECE4] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-start">

        {/* Columna Izquierda: Título, Subtítulo y Descripción */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-6 sm:space-y-8 lg:space-y-10 lg:pr-8"
        >
          <div className="flex flex-col space-y-4 sm:space-y-8">
            <Image
              src={aboutusTitle}
              alt="Sobre Nosotros"
              className="w-full max-w-[75vw] sm:max-w-[480px] lg:max-w-[600px] object-contain invert-[0.9]"
            />

            {/* Separador de Oro Premium Metálico con Diamante */}
            <div className="flex items-center gap-3 sm:gap-4">
              <BsDiamondFill className="w-2 sm:w-3 h-2 sm:h-3 text-[#845f15] drop-shadow-[0_0_4px_rgba(255,210,119,0.8)]" />
              <div
                className="h-[1.5px] w-28 sm:w-64"
                style={{
                  background: 'linear-gradient(to right, #77530a, #ffd277, transparent)',
                }}
              />
            </div>
          </div>

          {/* Subtítulo sobre la descripción */}
          <div className="w-full text-left">
            <p className="text-base sm:text-2xl text-[#523B2D] font-serif tracking-wide leading-relaxed">
              Experiencia{' '}
              <span className="font-script text-xl sm:text-4xl text-[#77530a] tracking-normal font-normal p-1">
                personalizada
              </span>{' '}
              <br className="hidden sm:inline" /> dedicada a la estética y el{' '}
              <span className="font-script text-xl sm:text-4xl text-[#77530a] tracking-normal font-normal p-1">
                bienestar
              </span>
            </p>
          </div>

          <div className="space-y-3 sm:space-y-5 text-[#523B2D] font-serif text-sm sm:text-lg leading-relaxed text-left sm:text-justify whitespace-pre-line">
            <p>{description}</p>
          </div>
        </motion.div>

        {/* Columna Derecha: Imagen */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center justify-center w-full"
        >
          {/* Imagen (estilo ventana abovedada para darle un toque premium, sin bordes ni sombras) */}
          <div className="w-full max-w-[280px] sm:max-w-md lg:max-w-none relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-t-full overflow-hidden">
            <Image
              src={aboutusImage}
              alt="Instalaciones Kad Bay Studio"
              fill
              className="object-cover"
            />
          </div>

        </motion.div>
      </div>
    </section>
  );
}
