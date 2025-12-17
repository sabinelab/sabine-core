import { prisma } from '@/database'
import {
  $Enums,
  type Event,
  type Guild,
  type LiveMessage,
  type TBDMatch
} from '@generated'

export class SabineGuild implements Guild {
  public id: string
  public lang: $Enums.Language = 'en'
  public tbd_matches: TBDMatch[] = []
  public guildKeyId: string | null = null
  public events: Event[] = []
  public live_messages: LiveMessage[] = []
  public valorant_resend_time: Date | null = null
  public valorant_matches: string[] = []
  public valorant_news_channel: string | null = null
  public valorant_live_feed_channel: string | null = null
  public lol_resend_time: Date | null = null
  public lol_matches: string[] = []
  public lol_news_channel: string | null = null
  public lol_live_feed_channel: string | null = null
  public tournaments_length: number = 5
  public partner: boolean | null = null
  public invite: string | null = null

  public constructor(id: string) {
    this.id = id
  }

  public async save() {
    const data: Partial<Guild> = {}

    for(const key in this) {
      if(
        typeof this[key] === 'function' ||
        key === 'id' ||
        this[key] === null
      ) continue

      if(
        ['tbd_matches', 'events', 'live_messages']
          .includes(key)
      ) {
        (data as any)[key] = {
          [key]: Array.isArray(this[key]) &&
            this[key].length ?
            {
              create: this[key]
            } :
            undefined
        }
      }

      else (data as any)[key] = this[key]
    }

    return await prisma.guild.upsert({
      where: { id: this.id },
      update: data,
      create: { id: this.id, ...data }
    })
  }
  public static async fetch(id: string) {
    const data = await prisma.guild.findUnique({ where: { id } })

    if(!data) return data

    const guild = new SabineGuild(data.id)

    return Object.assign(guild, data)
  }
}