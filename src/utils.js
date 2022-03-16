export function getCardinalPoints(lat, lng) {
  const latRadian = lng * Math.PI/180
  const lngRadian = lat * Math.PI/180
  return {
      x: Math.cos(lngRadian) * Math.sin(latRadian),
      y: Math.sin(lngRadian * Math.PI/180) * Math.cos(latRadian),
      z: Math.cos(latRadian)
  }
}
