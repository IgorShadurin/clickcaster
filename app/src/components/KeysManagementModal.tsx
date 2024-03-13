import React from 'react'
import { Button, InputGroup, Modal, Form } from 'react-bootstrap'
import { HDNodeWallet } from 'ethers'
import { accessKeyList, IKey } from '../service/api'
import { getAuthData } from '../service/storage'

export function KeysManagementModal({
  show,
  handleClose,
  onSave,
}: {
  show: boolean
  handleClose: () => void
  onSave: (keyId: string) => Promise<void>
}) {
  const [newKey, setNewKey] = React.useState<HDNodeWallet>()
  const [list, setList] = React.useState<IKey[]>([])

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onShow={async () => {
        setNewKey(undefined)
        setList((await accessKeyList(getAuthData()!)).list)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Keys Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center w-100">
          <Button
            disabled={Boolean(newKey)}
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setNewKey(HDNodeWallet.createRandom())
            }}
          >
            <i className="bi bi-plus"></i> Create Key
          </Button>
        </div>

        {list.length === 0 && <p className="text-sm mt-3">No keys</p>}
        {list.length > 0 && (
          <>
            <p className="text-sm mt-3">Already created keys</p>
            {list.map((item, index) => (
              <p key={index} className="text-sm mt-3">
                {item.eth_address}
              </p>
            ))}
          </>
        )}

        {newKey && (
          <>
            <p className="mt-5 text-sm">Write down the information for future use.</p>
            <InputGroup size="sm" className="mt-3">
              <InputGroup.Text id="inputGroup-sizing-sm">ID</InputGroup.Text>
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled={true}
                value={newKey.address.replace('0x', '').toLowerCase()}
              />
            </InputGroup>

            <InputGroup size="sm" className="my-3">
              <InputGroup.Text id="inputGroup-sizing-sm">PK</InputGroup.Text>
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                disabled={true}
                value={newKey.privateKey}
              />
            </InputGroup>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          size="sm"
          onClick={async () => {
            if (newKey) {
              onSave(newKey.address.replace('0x', '').toLowerCase())
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
