import express from 'express'
import addAction from './add-action'

const router = express.Router()
router.post('/add', addAction)

export default router
