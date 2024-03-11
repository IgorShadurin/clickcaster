import express from 'express'
import registerAction from './register-action'
import logAction from './log-action'

const router = express.Router()
router.post('/register', registerAction)
router.post('/log', logAction)

export default router
