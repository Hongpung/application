export const isEditible = (date: string) => {

    const utcTime = new Date();
    const koreaTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);
    const limitTime = new Date(new Date(date).getTime() - 2 * 60 * 60 * 1000)
    return koreaTime <= limitTime

}