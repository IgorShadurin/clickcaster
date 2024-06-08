import express from 'express'
import testAction from './test-action'
import stataAction from './stata-action'

const router = express.Router()
router.get('/test', testAction)
router.get('/stata', stataAction)

export default router
