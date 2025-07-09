import { useLoadOccupiedTimesFetch } from "@hongpung/src/entities/reservation";

export const useOccupiedTimes = ({
  date,
  reservationId,
}: {
  date: string;
  reservationId?: number;
}) => {
  const { data, error, isLoading } = useLoadOccupiedTimesFetch({
    date: new Date(date),
  });

  if (reservationId) {
    const occupiedTimes =
      data
        ?.filter((reservation) => reservation.reservationId !== reservationId)
        .map((reservation) => reservation.times)
        .flat() || [];
    return { occupiedTimes, error, isLoading };
  } else {
    const occupiedTimes =
      data?.map((reservation) => reservation.times).flat() || [];
    return { occupiedTimes, error, isLoading };
  }
};
