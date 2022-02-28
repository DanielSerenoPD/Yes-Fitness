export const getKilometros = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  let rad = function (x: number) {
    return (x * Math.PI) / 180;
  };
  let R = 6378.137; //Radio de la tierra en km
  let dLat = rad(lat2 - lat1);
  let dLong = rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d.toFixed(3); //Retorna tres decimales
};
