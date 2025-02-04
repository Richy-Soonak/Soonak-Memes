import express, { Router, Request, Response } from 'express'
import Moralis from 'moralis'
import {
  check,
  validationResult,
  ValidationError,
  Result,
} from 'express-validator'
import User from '../../models/User'
import jwt from 'jsonwebtoken'
import config from '../../config'
import auth from '../../middleware/auth'

const router: Router = express.Router()

// route: api/user/register
// description: user register
// method: POST and it's public
interface AuthRequest extends Request {
  user?: {
    _id: string
    wallet: string
    fullName: string
    company: string
    avatar: string
    bio: string
    website: string
    twitter: string
    linkedin: string
    facebook: string
    instagram: string
    farcaster: string
    lens: string
  }
}

router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  res.json(req.user)
})

router.post('/request-message', async (req: Request, res: Response) => {
  const { network, address } = req.body
  try {
    const message = await Moralis.Auth.requestMessage({
      address: String(address),
      network: String(network),
      networkType: 'solana',
      ...config.moralis,
    })

    res.status(200).json({
      ...message.toJSON(),
      user: true,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
    console.error(error)
  }
})

router.post(
  '/signin',
  [
    check('message', 'Message is required').notEmpty(),
    check('message', 'Message length should be 1 to 1000 characters').isLength({
      min: 1,
      max: 1000,
    }),
    check('signature', 'Signature is required').notEmpty(),
    check(
      'signature',
      'Signature length should be 1 to 1500 characters'
    ).isLength({
      min: 1,
      max: 1000,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const { message, signature } = req.body
      const { address, profileId } = (
        await Moralis.Auth.verify({
          message,
          signature,
          networkType: 'solana',
        })
      ).raw
      const _user = await User.findOneAndUpdate(
        { wallet: address },
        { wallet: address },
        { new: true, upsert: true }
      )
      const _data = {
        wallet: _user.wallet,
        fullName: _user.fullName,
        company: _user.company,
        ip: _user.ip,
        avatar: _user.avatar,
      }
      const token = jwt.sign({ data: _data }, config.jwtSecret, {
        expiresIn: 60 * 60 * 24,
      })
      res.status(200).json(token)
    } catch (err) {
      res.status(500).json({ status: 'ERR', data: err })
      console.log(err)
    }
  }
)

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { message, signature, user } = req.body
    const { address, profileId } = (
      await Moralis.Auth.verify({
        message,
        signature,
        networkType: 'solana',
      })
    ).raw

    const _user = await User.findOne({ wallet: address })
    if (_user) {
      res.status(200).json('exists')
    } else {
      await new User({ wallet: address, ...user, ip: '127.0.0.1' }).save()
      const _data = {
        wallet: address,
        fullName: user.fullName,
        company: user.company,
        ip: '127.0.0.1',
        avatar: user.avatar,
      }
      const token = await jwt.sign({ data: _data }, config.jwtSecret, {
        expiresIn: 60 * 60 * 24,
      })
      res.status(200).json(token)
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get(
  '/signinWithToken',
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const _user = await User.findOne({ wallet: req.user.wallet })

      if (_user) {
        const _data = {
          wallet: _user.wallet,
          fullName: _user.fullName,
          company: _user.company,
          ip: _user.ip,
          avatar: _user.avatar,
        }
        const token = jwt.sign({ data: _data }, config.jwtSecret, {
          expiresIn: 60 * 60 * 24,
        })
        res.status(200).json(token)
      } else {
        res.status(200).json('none')
      }
    } catch (err) {
      res.status(400).json('error')
    }
  }
)

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const _user = await User.findOne({ wallet: id })
    res.json(_user)
  } catch (err) {
    res.status(500).json({ status: 'ERR', data: err })
  }
})

router.get('/', auth, async (req: AuthRequest, res: Response) => {
  res.json({ data: req.user })
})

router.put('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    await User.findOneAndUpdate(
      { wallet: req.user.wallet },
      { ...req.body },
      {
        new: true,
        upsert: true,
      }
    )
    res.status(200).json('success')
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

export default router
