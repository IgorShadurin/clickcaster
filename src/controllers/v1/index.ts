import app from './app'
import data from './data'
import express from 'express'

const router = express.Router()

router.use('/app', app)
router.use('/data', data)

export default router
