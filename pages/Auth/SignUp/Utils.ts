
export const vaildatePassword = (password:string) => {
    const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
    const newCondition = regex.test(password);
    console.log(password, newCondition)
    return newCondition;
}