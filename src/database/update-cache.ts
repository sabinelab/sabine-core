import { redis } from '@/database'

export const voidCatch = () => {}

export const updateCache = async(key: string, data: unknown, ignoreNull?: boolean) => {
  const value = await redis.get(key)

  if(!value && ignoreNull) return

  redis.set(key,
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    ),
    {
      expiration: {
        type: 'EX',
        value: 300
      }
    }
  )
  .catch(voidCatch)
}