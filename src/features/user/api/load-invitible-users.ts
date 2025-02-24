import { addTokenToHeader, getToken } from "@hongpung/src/common/lib/TokenHandler";
import { User, userApi } from "@hongpung/src/entities/user";

export async function loadInvitableUsers(findOptions: { username: string, club: string[], enrollmentNumberRange: { startNumber?: string, endNumber?: string } }): Promise<User[]> {

    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const { url, method } = userApi.loadInvitableUsers(findOptions);

    try {
        const token = await getToken('token');

        if (!token) throw Error('token is not valid')

        const response = await fetch(url,
            {
                method,
                headers: { ...addTokenToHeader(token) },
                signal
            }
        )

        if (!response.ok) throw Error('Load reservations is failed')

        const loadedUsers = await response.json() as User[];

        return loadedUsers;

    } catch (e) {

        throw Error('Load users is failed')

    } finally {
        clearTimeout(timeoutId);
    }
}