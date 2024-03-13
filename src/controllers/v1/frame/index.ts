import express from 'express'
import addAction from './add-action'
import listAction from './list-action'

const router = express.Router()
router.post('/list', listAction)
router.post('/add', addAction)

export default router
