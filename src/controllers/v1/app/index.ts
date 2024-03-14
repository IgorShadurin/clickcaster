import express from 'express'
import testAction from './test-action'
import friendsAction from './friends-action'
import friendsListAction from './friends-list-action'
import emailAction from './email-action'
import stataAction from './stata-action'

const router = express.Router()
router.get('/test', testAction)
router.get('/friends', friendsAction)
router.post('/friends', friendsAction)
router.get('/friends-list', friendsListAction)

router.get('/email', emailAction)
router.post('/email', emailAction)

router.get('/stata', stataAction)

export default router
