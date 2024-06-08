import express from 'express'
import addFrameAction from './add-frame-action'

const router = express.Router()
router.post('/add-frame', addFrameAction)

export default router
