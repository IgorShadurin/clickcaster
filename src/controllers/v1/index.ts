import app from './app'
import data from './data'
import click from './click'
import accessKey from './access-key'
import express from 'express'

const router = express.Router()

router.use('/app', app)
router.use('/data', data)
router.use('/click', click)
router.use('/access-key', accessKey)

export default router
