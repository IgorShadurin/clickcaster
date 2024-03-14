import React, { useEffect } from 'react'
import { KeysManagementModal } from './KeysManagementModal'
import { accessKeyAdd, frameAdd, frameList, IFrame, IFrameCreation } from '../service/api'
import { getAuthData } from '../service/storage'
import { FramesList } from './FramesList'
import { FramesManagementModal } from './FramesManagementModal'
import { extractFidFromMessage } from '../utils/farcaster'

export function MainLogged() {
  const [showKeysModal, setShowKeysModal] = React.useState(false)
  const [showFramesModal, setShowFramesModal] = React.useState(false)
  const [frames, setFrames] = React.useState<IFrame[]>([])

  async function updateFrames() {
    setFrames((await frameList(getAuthData()!)).list)
  }

  useEffect(() => {
    updateFrames().then()
  }, [])

  return (
    <main>
      <div className="pt-56 pb-10 pt-lg-56 pb-lg-0 mt-n40 mx-lg-auto w-lg-75">
        <div className="container">
          <button
            className="btn btn-primary btn-xs"
            onClick={() => {
              setShowFramesModal(true)
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
            <FramesList frames={frames} />
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

      <FramesManagementModal
        fid={extractFidFromMessage(getAuthData()!.message)}
        show={showFramesModal}
        handleClose={() => {
          setShowFramesModal(false)
        }}
        onSave={async (data: IFrameCreation) => {
          const authData = getAuthData()
          if (!authData) {
            alert('No auth data found')
            return
          }

          const insertInfo = await frameAdd(data, authData)
          await updateFrames()
          // @ts-ignore
          if (insertInfo.status !== 'ok') {
            // @ts-ignore
            return insertInfo.message
          }else {
            return ''
          }
        }}
      />
    </main>
  )
}
