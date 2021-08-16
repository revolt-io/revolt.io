import type { Response } from 'node-fetch'

export const parseResponse = (res: Response): Promise<unknown> => {
    if (res.headers.get('Content-Type')?.startsWith('application/json')) {
        return res.json()
    }
    return res.buffer()
}
