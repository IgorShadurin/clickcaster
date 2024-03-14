import express from 'express'
import upsertAction from './upsert-action'

const router = express.Router()
router.post('/upsert', upsertAction)

export default router
