import { useCallback, useEffect, useState } from 'react'
import { KeysManagementModal } from './KeysManagementModal'
import { accessKeyAdd, frameAdd, frameList, IFrame, IFrameCreation } from '../service/api'
import { FramesList } from './FramesList'
import { FramesManagementModal } from './FramesManagementModal'
import { useAppSelector } from '../redux/hooks'
import { selectAuth } from '../redux/reducers/authSlice'
import { TopFramesModal } from './TopFramesModal'

export function MainLogged() {
  const [showKeysModal, setShowKeysModal] = useState(false)
  const [showFramesModal, setShowFramesModal] = useState(false)
  const [topFramesModal, setTopFramesModal] = useState(false)
  const [frames, setFrames] = useState<IFrame[]>([])
  const auth = useAppSelector(selectAuth)

  const updateFrames = useCallback(async () => {
    setFrames((await frameList(auth)).list);
  }, [auth, setFrames]);

  useEffect(() => {
    updateFrames().then()
  }, [updateFrames])

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
            <i className="bi bi-key"></i> Add Key
          </button>

          <button
            className="btn btn-outline-primary btn-xs"
            onClick={() => {
              setTopFramesModal(true)
            }}
          >
            <i className="bi"></i> Top Frames
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
          await accessKeyAdd(keyId, auth)
        }}
      />

      <FramesManagementModal
        fid={auth.fid}
        show={showFramesModal}
        handleClose={() => {
          setShowFramesModal(false)
        }}
        onSave={async (data: IFrameCreation) => {
          const insertInfo = await frameAdd(data, auth)
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

      <TopFramesModal
        show={topFramesModal}
        handleClose={() => {
          setTopFramesModal(false)
        }}
      />
    </main>
  )
}
