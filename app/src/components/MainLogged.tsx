import React from 'react'
import { KeysManagementModal } from './KeysManagementModal'
import { accessKeyAdd } from '../service/api'
import { getAuthData } from '../service/storage'
import { FramesList } from './FramesList'

export function MainLogged() {
  const [showKeysModal, setShowKeysModal] = React.useState(false)

  return (
    <main>
      <div className="pt-56 pb-10 pt-lg-56 pb-lg-0 mt-n40 mx-lg-auto w-lg-75">
        <div className="container">
          <button
            disabled={true}
            className="btn btn-primary btn-xs"
            onClick={() => {
              // todo show AddFrameModal
            }}
          >
            <i className="bi bi-plus"></i> Add Frame
          </button>

          <button
            className="btn btn-outline-primary btn-xs mx-3"
            onClick={() => {
              setShowKeysModal(true)
            }}
          >
            <i className="bi bi-key"></i> Add key
          </button>

          <div className="mt-8">
            <FramesList />
          </div>
        </div>
      </div>

      <KeysManagementModal
        show={showKeysModal}
        handleClose={() => {
          setShowKeysModal(false)
        }}
        onSave={async (keyId: string) => {
          const authData = getAuthData()
          if (!authData) {
            alert('No auth data found')
            return
          }

          await accessKeyAdd(keyId, authData)
        }}
      />
    </main>
  )
}
