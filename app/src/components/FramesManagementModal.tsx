import React from 'react'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap'
import { IFrameCreation } from '../service/api'
import { CopyButton } from './CopyButton'

export function FramesManagementModal({
  fid,
  show,
  handleClose,
  onSave,
}: {
  fid: number
  show: boolean
  handleClose: () => void
  onSave: (data: IFrameCreation) => Promise<string>
}) {
  const defaultFrame: IFrameCreation = {
    id: 0,
    title: '',
    description: '',
    url: '',
    statistics: {
      total_actions: 0,
      unique_users: 0,
    },
  }
  const [newFrame, setNewFrame] = React.useState<IFrameCreation>(defaultFrame)
  const [error, setError] = React.useState<string>('')
  const [saveDisabled, setSaveDisabled] = React.useState<boolean>(false)

  const verifyTag = `<meta property="frame:owner" content="${fid}"/>`

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onShow={async () => {
        setNewFrame(defaultFrame)
        setError('')
        setSaveDisabled(false)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Frames Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="mb-5">
            {error && <p className="text-sm text-danger mb-3">{error}</p>}
            <p className="text-sm">
              Ensure your frame's GET request response includes a unique account tag. Without it, frame addition is not possible.
            </p>

            <InputGroup size="sm" className="mt-3">
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled={true}
                value={verifyTag}
              />
              <CopyButton text={verifyTag} />
            </InputGroup>
          </div>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title of the Frame"
              maxLength={255}
              value={newFrame.title}
              onChange={input =>
                setNewFrame({
                  ...newFrame,
                  title: input.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              maxLength={1024}
              value={newFrame.description}
              onChange={input =>
                setNewFrame({
                  ...newFrame,
                  description: input.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="URL of the Frame"
              maxLength={768}
              value={newFrame.url}
              onChange={input =>
                setNewFrame({
                  ...newFrame,
                  url: input.target.value,
                })
              }
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
          disabled={!newFrame.title || !newFrame.description || !newFrame.url || saveDisabled}
          variant="primary"
          size="sm"
          onClick={async () => {
            setError('')
            let errorData = ''
            if (newFrame) {
              setSaveDisabled(true)
              errorData = await onSave(newFrame)
              setError(errorData)
              setSaveDisabled(false)
            }

            if (!errorData) {
              handleClose()
            }
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
