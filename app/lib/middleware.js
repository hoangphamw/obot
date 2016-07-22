import config from '../config'
import logger from './logger'
import { userResponse } from './messenger'
import { updateState } from './state'

const log = logger('obot.middleware')

export function getPing(req, res) {
  res.status(config.OK).json({ ping: 'pong' })
}

export function verifyCredentials(req, res) {
	if (req.query['hub.verify_token'] === config.verifyToken) {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong validation token')
}

export function handleMsgEvents(req, res) {
	const messaging_events = req.body.entry[0].messaging
	let i
	for (i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id

		if (event.message && event.message.text) {
			let text = event.message.text
			userResponse(sender, text)
			// Update user state for smart interactions
			updateState(redis, sender)
		}
		if (event.postback) {
        	let text = event.postback
        	sendTextMessage(sender, "Postback received: " + text)
        	continue
      	}
	}
	res.sendStatus(200)
}