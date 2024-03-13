import { IFrame } from '../interfaces/IFrame'

export function FramesList({frames}: {frames: IFrame[]}) {
  return <>
    {frames.length === 0 && <p>No frames to display.</p>}
    {frames.length > 0 && <p>No frames to display.</p>}
  </>
}
