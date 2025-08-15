import { v4 as uuidv4 } from 'uuid'

export function getOrCreateUserId() {
    const storageKey = 'user_id'
    let userId = localStorage.getItem(storageKey)

    if (!userId) {
        userId = uuidv4()
        localStorage.setItem(storageKey, userId)
    }

    return userId
}
