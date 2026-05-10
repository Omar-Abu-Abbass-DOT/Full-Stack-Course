"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function MapEmbed({ lat, lng, height = 320 }) {
  const { t } = useLocale();
  if (lat === undefined || lng === undefined || lat === null || lng === null) {
    return null;
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;

  const delta = 0.012;
  const bbox = `${lngNum - delta},${latNum - delta},${lngNum + delta},${latNum + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latNum},${lngNum}`;
  const directionsUrl = `https://www.openstreetmap.org/?mlat=${latNum}&mlon=${lngNum}#map=16/${latNum}/${lngNum}`;

  return (
    <div className="card mb-6">
      <div className="card-body">
        <div className="flex justify-between items-center mb-3" style={{ flexWrap: "wrap", gap: 8 }}>
          <h3 className="font-bold" style={{ marginBottom: 0 }}>
            📍 {t("service.locationMap")}
          </h3>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            {t("service.directions")} →
          </a>
        </div>
        <div className="map-wrap">
          <iframe
            src={src}
            width="100%"
            height={height}
            loading="lazy"
            title="Service location map"
          />
        </div>
      </div>
    </div>
  );
}
