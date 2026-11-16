'use client';

import React, { useState } from "react";

/* ---------- Tipos ---------- */

export interface LoyaltyTheme {
  /** Fondo principal de la tarjeta */
  background: string;
  /** Segundo color del degradé de fondo */
  backgroundAccent: string;
  /** Color del texto */
  text: string;
  /** Color de acento (íconos, script, sellos, círculos) */
  accent: string;
  /** Versión suave del acento (chip, ramitas, franja) */
  accentSoft: string;
  /** Color del texto sobre el acento (ej: los % de descuento) */
  onAccent: string;
}

export interface LoyaltyCardProps {
  /** URL / import de la imagen del logo. Si falta, usa un monograma con iniciales */
  logo?: string;
  /** Nombre del negocio (el grande, en script) */
  businessName?: string;
  /** Texto chico bajo el logo (por defecto = businessName). Admite "\n" */
  brandLabel?: string;
  /** Texto bajo el nombre (ej: "Nail Studio") */
  tagline?: string;
  /** Nombre del cliente (reemplaza el número de tarjeta; se repite en el dorso) */
  clientName?: string;
  cardTitle?: string;
  instagram?: string;
  whatsapp?: string;
  badge?: string;
  /** Etiqueta del dorso ("Nombre:") */
  nameLabel?: string;
  /** Cantidad de casilleros de sellos del dorso */
  stampsTotal?: number;
  /** Cuántos sellos están completados */
  stampsCollected?: number;
  /** Premios del dorso, ej ["10%", "15%"] */
  discounts?: string[];
  /** Colores. Lo que no pases toma el valor del tema dorado */
  theme?: Partial<LoyaltyTheme>;
  scriptFont?: string;
  baseFont?: string;
  /** Ancho en px (todo escala solo) */
  width?: number;
  /** Arrancar mostrando el dorso */
  defaultFlipped?: boolean;
  /** Callback al voltear */
  onFlip?: (flipped: boolean) => void;
}

/**
 * Temas listos para usar. Podés pasar uno de estos o armar el tuyo
 * con las mismas keys en la prop `theme`.
 */
export const THEMES: Record<"dorado" | "rosa" | "esmeralda" | "noche", LoyaltyTheme> = {
  dorado: {
    background: "#fdf3e3",
    backgroundAccent: "#f4dfbd",
    text: "#8a4b2a",
    accent: "#c8872e",
    accentSoft: "#e9c88f",
    onAccent: "#ffffff",
  },
  rosa: {
    background: "#fff1f3",
    backgroundAccent: "#fbd5dc",
    text: "#8c2f45",
    accent: "#d6587a",
    accentSoft: "#f2a9bc",
    onAccent: "#ffffff",
  },
  esmeralda: {
    background: "#eef7f1",
    backgroundAccent: "#cde8d7",
    text: "#1f5a3d",
    accent: "#2f9466",
    accentSoft: "#8fd0ad",
    onAccent: "#ffffff",
  },
  noche: {
    background: "#1d1b24",
    backgroundAccent: "#2c2838",
    text: "#e9dcc0",
    accent: "#d4a94f",
    accentSoft: "#8a7340",
    onAccent: "#1d1b24",
  },
};

/* ---------- Estilos globales del componente (animaciones) ---------- */

const CSS = `
.lc-scene { cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent; user-select: none; }
.lc-scene:focus-visible .lc-card { outline: 2px solid var(--lc-accent); outline-offset: 6px; border-radius: 1em; }
.lc-lift { perspective: 1400px; }
.lc-lift.lc-pop { animation: lc-pop 0.9s cubic-bezier(.3,.7,.3,1); }
.lc-card { transform-style: preserve-3d; transition: transform 0.9s cubic-bezier(.4,.1,.2,1); }
.lc-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.lc-shine { position:absolute; inset:0; pointer-events:none; opacity:0;
  background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%);
  transform: translateX(-100%); }
.lc-pop .lc-shine { animation: lc-shine 0.9s ease-out; }
@keyframes lc-pop {
  0%   { transform: translateY(0) scale(1) rotate(0deg); }
  30%  { transform: translateY(-0.6em) scale(1.06) rotate(-1.5deg); }
  70%  { transform: translateY(-0.3em) scale(1.04) rotate(1deg); }
  100% { transform: translateY(0) scale(1) rotate(0deg); }
}
@keyframes lc-shine {
  0%   { opacity: 0; transform: translateX(-100%); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: translateX(100%); }
}
@media (prefers-reduced-motion: reduce) {
  .lc-card { transition-duration: 0.01ms !important; }
  .lc-lift.lc-pop, .lc-pop .lc-shine { animation: none !important; }
}
`;

/* ---------- Helpers ---------- */

// Posiciona un elemento por su centro, en % del tamaño de la tarjeta
const at = (x: number, y: number): React.CSSProperties => ({
  position: "absolute",
  left: `${x}%`,
  top: `${y}%`,
  transform: "translate(-50%, -50%)",
});

/* ---------- Iconos y decoraciones ---------- */

const InstagramIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="var(--lc-accent)" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="var(--lc-accent)" stroke="none" />
  </svg>
);

const WhatsappIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="var(--lc-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z" />
    <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z" fill="var(--lc-accent)" stroke="none" />
  </svg>
);

const Chip: React.FC = () => (
  <svg viewBox="0 0 48 36" width="100%" height="100%">
    <rect x="1" y="1" width="46" height="34" rx="6" fill="var(--lc-accent)" />
    <g stroke="var(--lc-accent-soft)" strokeWidth="1.4" fill="none">
      <path d="M1 12h14v12H1M47 12H33v12h14M15 12c0-6 4-11 9-11s9 5 9 11M15 24c0 6 4 11 9 11s9-5 9-11" />
      <path d="M24 1v34" />
    </g>
  </svg>
);

const Contactless: React.FC = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="var(--lc-accent)" strokeWidth="2.2" strokeLinecap="round">
    <path d="M7 8.5c1.3 2 1.3 5 0 7" />
    <path d="M11 6c2.2 3.4 2.2 8.6 0 12" />
    <path d="M15 3.5c3 4.8 3 12.2 0 17" />
  </svg>
);

interface LeafPoint {
  x: number;
  y: number;
  r: number;
}

const LEAVES: LeafPoint[] = [
  { x: 20, y: 77, r: -75 }, { x: 20, y: 77, r: -5 },
  { x: 42, y: 65, r: -75 }, { x: 42, y: 65, r: -5 },
  { x: 64, y: 50, r: -75 }, { x: 64, y: 50, r: -5 },
  { x: 86, y: 32, r: -75 }, { x: 86, y: 32, r: -5 },
  { x: 106, y: 15, r: -40 },
];

const Leaves: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 120 90" aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <path d="M5 85 C 40 70, 70 45, 115 10" fill="none" stroke="var(--lc-accent)" strokeOpacity=".6" strokeWidth="1.2" />
    {LEAVES.map((l, i) => (
      <path
        key={i}
        d="M0 0 C 5 -7 15 -7 22 0 C 15 7 5 7 0 0 Z"
        transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}
        fill="var(--lc-accent-soft)"
        fillOpacity=".6"
        stroke="var(--lc-accent)"
        strokeOpacity=".6"
        strokeWidth=".8"
      />
    ))}
  </svg>
);

/* ---------- Logo (imagen o monograma de respaldo) ---------- */

interface LogoProps {
  logo?: string;
  businessName: string;
}

const Logo: React.FC<LogoProps> = ({ logo, businessName }) => {
  if (logo) {
    return (
      <img
        src={logo}
        alt={`Logo de ${businessName}`}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    );
  }
  const initials = (businessName || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        border: "0.1em solid var(--lc-accent)",
        color: "var(--lc-accent)",
        fontWeight: 700,
        fontSize: "1.1em",
        letterSpacing: "0.05em",
        boxSizing: "border-box",
      }}
    >
      {initials}
    </div>
  );
};

/* ---------- Frente ---------- */

interface FrontProps {
  logo?: string;
  businessName: string;
  brandLabel?: string;
  tagline: string;
  clientName: string;
  cardTitle: string;
  instagram?: string;
  whatsapp?: string;
  badge: string;
}

const Front: React.FC<FrontProps> = ({
  logo,
  businessName,
  brandLabel,
  tagline,
  clientName,
  cardTitle,
  instagram,
  whatsapp,
  badge,
}) => {
  const nameSize = Math.min(2.4, 28 / Math.max(clientName.length, 1));
  const scriptSize = Math.min(2.9, 34 / Math.max(businessName.length, 1));

  return (
    <>
      <Leaves style={{ top: 0, right: 0, width: "22%", transform: "rotate(180deg)" }} />

      {/* Logo + nombre en versalitas (arriba a la izquierda) */}
      <div style={{ ...at(17.5, 14), width: "11%", aspectRatio: "1" }}>
        <Logo logo={logo} businessName={businessName} />
      </div>
      <div
        style={{
          ...at(17.5, 32),
          fontSize: "0.6em",
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          textAlign: "center",
          whiteSpace: "pre-line",
          lineHeight: 1.5,
        }}
      >
        {brandLabel ?? businessName}
      </div>

      {/* Nombre grande en script + tagline */}
      <div
        style={{
          ...at(63, 26),
          fontFamily: "var(--lc-script-font)",
          fontSize: `${scriptSize}em`,
          lineHeight: 1,
          color: "var(--lc-accent)",
          whiteSpace: "nowrap",
        }}
      >
        {businessName}
      </div>
      {tagline && (
        <div
          style={{
            ...at(64, 41),
            fontSize: "0.7em",
            fontWeight: 600,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {tagline}
        </div>
      )}

      {/* Chip + contactless */}
      <div style={{ ...at(13, 52), width: "9%", aspectRatio: "4 / 3" }}>
        <Chip />
      </div>
      <div style={{ ...at(23, 52), width: "3.6%", aspectRatio: "1" }}>
        <Contactless />
      </div>

      {/* Nombre del cliente (reemplaza el número) */}
      <div
        style={{
          position: "absolute",
          left: "8.5%",
          top: "64%",
          transform: "translateY(-50%)",
          maxWidth: "83%",
          fontSize: `${nameSize}em`,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.15,
        }}
      >
        {clientName}
      </div>

      {/* Título */}
      <div
        style={{
          position: "absolute",
          left: "8.5%",
          top: "74%",
          transform: "translateY(-50%)",
          fontSize: "0.85em",
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {cardTitle}
      </div>

      {/* Instagram / WhatsApp */}
      {instagram && (
        <div style={{ position: "absolute", left: "7.5%", top: "89%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "0.5em", fontSize: "0.85em", fontWeight: 600, whiteSpace: "nowrap" }}>
          <span style={{ width: "1.5em", height: "1.5em", flex: "none" }}><InstagramIcon /></span>
          {instagram}
        </div>
      )}
      {whatsapp && (
        <div style={{ position: "absolute", left: "41%", top: "89%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "0.5em", fontSize: "0.85em", fontWeight: 600, whiteSpace: "nowrap" }}>
          <span style={{ width: "1.5em", height: "1.5em", flex: "none" }}><WhatsappIcon /></span>
          {whatsapp}
        </div>
      )}

      {/* Círculos + Cliente VIP (abajo a la derecha) */}
      <div style={{ position: "absolute", right: "4%", bottom: "6%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4em" }}>
        <span style={{ position: "relative", width: "2.2em", height: "1.4em" }}>
          <span style={{ position: "absolute", left: 0, top: 0, width: "1.4em", height: "1.4em", borderRadius: "50%", background: "var(--lc-accent-soft)" }} />
          <span style={{ position: "absolute", right: 0, top: 0, width: "1.4em", height: "1.4em", borderRadius: "50%", background: "var(--lc-accent)" }} />
        </span>
        <span style={{ fontSize: "0.55em", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          {badge}
        </span>
      </div>
    </>
  );
};

/* ---------- Dorso ---------- */

interface BackProps {
  logo?: string;
  businessName: string;
  clientName: string;
  nameLabel: string;
  stampsTotal: number;
  stampsCollected: number;
  discounts: string[];
}

const Back: React.FC<BackProps> = ({
  logo,
  businessName,
  clientName,
  nameLabel,
  stampsTotal,
  stampsCollected,
  discounts,
}) => {
  const stamps: boolean[] = Array.from({ length: stampsTotal }, (_, i) => i < stampsCollected);

  return (
    <>
      {/* Franja superior */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6%",
          background: "linear-gradient(90deg, var(--lc-accent-soft), var(--lc-accent))",
        }}
      />

      <Leaves style={{ bottom: 0, right: 0, width: "22%", transform: "scaleX(-1)" }} />

      {/* Grilla: sellos en columnas de 2, premios en la última */}
      <div
        style={{
          position: "absolute",
          left: "3%",
          width: "96%",
          top: "26%",
          height: "50%",
          display: "grid",
          gridTemplateRows: "repeat(2, 1fr)",
          gridAutoFlow: "column",
          gridAutoColumns: "1fr",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {stamps.map((filled, i) => (
          <div
            key={`s${i}`}
            style={{
              width: "75%",
              maxWidth: "3.4em",
              aspectRatio: "1",
              borderRadius: "50%",
              border: "0.1em solid var(--lc-accent)",
              background: filled ? "var(--lc-accent)" : "transparent",
              padding: "0.35em",
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: "100%", height: "100%", filter: filled ? "brightness(0) invert(1)" : "none" }}>
              <Logo logo={logo} businessName={businessName} />
            </div>
          </div>
        ))}

        {discounts.map((d, i) => (
          <div
            key={`d${i}`}
            style={{
              width: "75%",
              maxWidth: "3.4em",
              aspectRatio: "1",
              borderRadius: "50%",
              background: "var(--lc-accent)",
              color: "var(--lc-on-accent)",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: "1em",
              boxShadow: "0 0.15em 0.4em rgba(0,0,0,0.18)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Nombre */}
      <div
        style={{
          position: "absolute",
          left: "4%",
          right: "19%",
          bottom: "7%",
          display: "flex",
          alignItems: "flex-end",
          gap: "0.6em",
          fontSize: "0.85em",
          fontWeight: 600,
        }}
      >
        <span style={{ letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{nameLabel}</span>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            borderBottom: "0.08em solid var(--lc-text)",
            minHeight: "1.3em",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {clientName}
        </span>
      </div>
    </>
  );
};

/* ---------- Componente principal ---------- */

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  logo,
  businessName = "Mi Negocio",
  brandLabel,
  tagline = "",
  clientName = "Nombre Apellido",
  cardTitle = "Tarjeta de fidelidad",
  instagram,
  whatsapp,
  badge = "Cliente VIP",
  nameLabel = "Nombre:",
  stampsTotal = 10,
  stampsCollected = 0,
  discounts = ["10%", "15%"],
  theme = THEMES.dorado,
  scriptFont = "'Great Vibes', 'Brush Script MT', cursive",
  baseFont = "'Montserrat', system-ui, sans-serif",
  width = 480,
  defaultFlipped = false,
  onFlip,
}) => {
  const [flipped, setFlipped] = useState<boolean>(defaultFlipped);
  const [popping, setPopping] = useState<boolean>(false);

  const t: LoyaltyTheme = { ...THEMES.dorado, ...theme };

  const toggle = (): void => {
    const next = !flipped;
    setFlipped(next);
    setPopping(false);
    // reinicia la animación aunque se haga click rápido
    requestAnimationFrame(() => setPopping(true));
    onFlip?.(next);
  };

  const sceneStyle = {
    "--lc-bg": t.background,
    "--lc-bg-accent": t.backgroundAccent,
    "--lc-text": t.text,
    "--lc-accent": t.accent,
    "--lc-accent-soft": t.accentSoft,
    "--lc-on-accent": t.onAccent,
    "--lc-script-font": scriptFont,
    width,
    fontSize: width / 28, // todo está en em: escala con el ancho
    fontFamily: baseFont,
    color: "var(--lc-text)",
  } as React.CSSProperties;

  const faceStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "1em",
    overflow: "hidden",
    background: "linear-gradient(135deg, var(--lc-bg) 0%, var(--lc-bg) 55%, var(--lc-bg-accent) 100%)",
    boxShadow: "0 0.6em 1.6em rgba(0,0,0,0.18)",
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) setPopping(false);
  };

  return (
    <div
      className="lc-scene"
      style={sceneStyle}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? "Tarjeta de fidelidad, mostrando el dorso. Click para ver el frente"
          : "Tarjeta de fidelidad, mostrando el frente. Click para ver el dorso"
      }
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      <style>{CSS}</style>

      <div className={`lc-lift${popping ? " lc-pop" : ""}`} onAnimationEnd={handleAnimationEnd}>
        <div
          className="lc-card"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "85.6 / 54",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Frente */}
          <div className="lc-face" style={faceStyle}>
            <Front
              logo={logo}
              businessName={businessName}
              brandLabel={brandLabel}
              tagline={tagline}
              clientName={clientName}
              cardTitle={cardTitle}
              instagram={instagram}
              whatsapp={whatsapp}
              badge={badge}
            />
            <div className="lc-shine" />
          </div>

          {/* Dorso */}
          <div className="lc-face" style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
            <Back
              logo={logo}
              businessName={businessName}
              clientName={clientName}
              nameLabel={nameLabel}
              stampsTotal={stampsTotal}
              stampsCollected={stampsCollected}
              discounts={discounts}
            />
            <div className="lc-shine" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCard;

/* ---------- Ejemplo de uso ----------

import LoyaltyCard, { THEMES, type LoyaltyTheme } from "./LoyaltyCard";
import logo from "./assets/logo-kb.png";

<LoyaltyCard
  logo={logo}
  businessName="kadbaystudio"
  brandLabel={"KAD BAY\nSTUDIO"}
  tagline="Nail Studio"
  clientName="María Pérez"
  instagram="@kadbaystudio"
  whatsapp="11 3423 3686"
  stampsCollected={4}
  discounts={["10%", "15%"]}
  theme={THEMES.dorado}
/>

Tema custom:
const violeta: LoyaltyTheme = {
  background: "#f5f0ff",
  backgroundAccent: "#ddd0ff",
  text: "#3d2a7a",
  accent: "#7a4cff",
  accentSoft: "#b9a2ff",
  onAccent: "#ffffff",
};

Fuentes (en index.html o tu CSS global):
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@500;600;700&display=swap" rel="stylesheet">

Si importás imágenes (import logo from "./logo.png") y TS se queja, agregá
un archivo `global.d.ts` con:  declare module "*.png";
*/
