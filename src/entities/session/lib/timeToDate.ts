export const timeToDate = (time: string): Date => {
    const utcTime = new Date();
    const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
    const today = koreaTime.toISOString().split('T')[0]

    return new Date(today + 'T' + time + '.000Z')
}