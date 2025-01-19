/**
 * 1. 로그인 정보를 담는 상태관리 변수 email, password가 있어야 함
 * 2. 로그인 정보의 상태를 담는 상태관리 변수가 있어야 하므로
 *    {password:string, state: error, errorText?:string}
 *     이런 식으로 구성하는게 더 이로움
 * 그렇게 하려면 inputComponet를 더 분리 해서 써야 함
 * 지금 해야될 일이 바로 그거네 inputComponent 리팩토링하고 즉각 적용하기
 */