import React from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { IFrameCreation } from '../service/api'

export function FramesManagementModal({
  show,
  handleClose,
  onSave,
}: {
  show: boolean
  handleClose: () => void
  onSave: (data: IFrameCreation) => Promise<void>
}) {
  const defaultFrame: IFrameCreation = {
    id: 0,
    title: '',
    description: '',
    url: '',
  }
  const [newFrame, setNewFrame] = React.useState<IFrameCreation>(defaultFrame)

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onShow={async () => {
        setNewFrame(defaultFrame)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Frames Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*<p className="mt-5 text-sm">Write down the information for future use.</p>*/}
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title of the Frame"
              maxLength={255}
              value={newFrame.title}
              onChange={input => setNewFrame({
                ...newFrame,
                title: input.target.value,
              })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              maxLength={1024}
              value={newFrame.description}
              onChange={input => setNewFrame({
                ...newFrame,
                description: input.target.value,
              })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="URL of the Frame"
              maxLength={768}
              value={newFrame.url}
              onChange={input => setNewFrame({
                ...newFrame,
                url: input.target.value,
              })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            handleClose()
          }}
        >
          Close
        </Button>
        <Button
          disabled={!newFrame.title || !newFrame.description || !newFrame.url}
          variant="primary"
          size="sm"
          onClick={async () => {
            if (newFrame) {
              onSave(newFrame)
            }

            handleClose()
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
