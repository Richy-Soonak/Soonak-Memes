import express, { Router, Request, Response } from 'express'
import axios from 'axios'
import { fetchTokenMetadata, makeNewTokenUri } from '../../utils/mpl'
const router: Router = express.Router()

router.get('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params
    const metadata = await fetchTokenMetadata(address)
    if (metadata.uri) {
      const _newUri = makeNewTokenUri(metadata.uri as string)
      const { data } = await axios.get(_newUri, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          Connection: 'keep-alive',
        },
      })
      res.status(200).json({
        status: 'SUCCESS',
        payload: { ...data, uri: _newUri },
      })
    } else {
      res.status(200).json({
        status: 'SUCCESS',
        payload: metadata,
      })
    }
  } catch (err: any) {
    if (String(err).includes('invalid token')) {
      res.json({
        status: 'ERR',
        msg: 'Invalid Token',
      })
    } else {
      res.json({
        status: 'ERR',
        msg: 'Failed to fetch Metadata',
      })
    }
  }
})
export default router
