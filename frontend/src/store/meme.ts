import { atom } from 'jotai'
import { Project } from '@/types/meme'

export const projectsAtom = atom<Project[]>([
  {
    ticker: 'Richy Soonak',
    symbol: 'SOONAK',
    description: 'This is the greatest meme coin in UK',
    publicKey: 'H218TQViAXsSqwCLnf7L41zewUTRmdN1r4neLtjBXYXS',
    logo: '/images/gallery.png',
    decimals: 9,
    marketCap: 1e12,
    price: 0.000001,
    memes: [
      {
        id: '1',
        name: 'Meme 1',
        image:
          'https://i.pinimg.com/564x/64/4e/4e/644e4e44064406440644064406440644.jpg',
        caption: 'Caption 1',
        likes: 0,
        dislikes: 0,
        heart: 0,
      },
      {
        id: '2',
        name: 'Meme 2',
        image:
          'https://i.pinimg.com/564x/64/4e/4e/644e4e44064406440644064406440644.jpg',
        caption: 'Caption 2',
        likes: 0,
        dislikes: 0,
        heart: 0,
      },
    ],
  },
])
