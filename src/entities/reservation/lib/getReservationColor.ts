export const getReservationColor = ({ reservationType, participationAvailable }: { reservationType?: ReservationType, participationAvailable: boolean }) => {
    if (reservationType === 'EXTERNAL') return 'grey'
    if (reservationType === 'REGULAR') return 'blue';
    if (participationAvailable) return 'green';//
    return 'red';
};