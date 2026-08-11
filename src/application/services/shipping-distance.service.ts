function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

interface BrasilApiCoordinates {
  location?: {
    coordinates?: {
      latitude?: string | number;
      longitude?: string | number;
    };
  };
}

async function fetchCepCoordinates(
  cep: string,
): Promise<{ lat: number; lng: number } | null> {
  const normalized = cep.replace(/\D/g, '').slice(0, 8);
  if (normalized.length !== 8) return null;

  const response = await fetch(
    `https://brasilapi.com.br/api/cep/v2/${normalized}`,
    { next: { revalidate: 86400 } },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as BrasilApiCoordinates;
  const coordinates = data.location?.coordinates;
  if (!coordinates?.latitude || !coordinates?.longitude) return null;

  const lat = Number(coordinates.latitude);
  const lng = Number(coordinates.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
}

export async function getDistanceKmBetweenCeps(
  originCep: string,
  destinationCep: string,
): Promise<number> {
  const [origin, destination] = await Promise.all([
    fetchCepCoordinates(originCep),
    fetchCepCoordinates(destinationCep),
  ]);

  if (!origin || !destination) {
    throw new Error(
      'Não foi possível obter coordenadas para calcular a distância entre os CEPs.',
    );
  }

  const distance = haversineKm(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng,
  );

  return Math.round(distance * 100) / 100;
}
