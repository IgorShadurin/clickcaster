import express from 'express'
import testAction from './test-action'
import stataAction from './stata-action'
import topStataAction from './top-stata-action'

const router = express.Router()
router.get('/test', testAction)
router.get('/stata', stataAction)
router.get('/top-stata', topStataAction)

export default router
