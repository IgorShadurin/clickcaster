import { IFrame } from '../service/api'
import { Table } from 'react-bootstrap'

export function FramesList({frames}: {frames: IFrame[]}) {
  return (
    <>
      {frames.length === 0 && <p>No frames to display.</p>}
      {frames.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {frames.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
