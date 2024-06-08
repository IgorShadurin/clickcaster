import express from 'express'
import data from './data'
import click from './click'
import accessKey from './access-key'
import frame from './frame'
import user from './user'
import provider from './provider'

const router = express.Router()

router.use('/data', data)
router.use('/click', click)
router.use('/access-key', accessKey)
router.use('/frame', frame)
router.use('/user', user)
router.use('/provider', provider)

export default router
