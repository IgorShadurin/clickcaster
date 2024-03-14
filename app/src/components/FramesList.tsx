import { IFrame } from '../service/api'
import { Table } from 'react-bootstrap'
import React from 'react'
import { formatNumber } from '../utils/number'

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
              <th>URL</th>
              <th>Statistics</th>
            </tr>
          </thead>
          <tbody>
            {frames.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.url}</td>
                <td>
                  {/*<button className="btn btn-outline-primary btn-xs">*/}
                  {/*  <i className="bi bi-bar-chart"></i> Analytics*/}
                  {/*</button>*/}
                  <p>Unique users: {formatNumber(item.statistics.unique_users)}</p>
                  <p>Total actions: {formatNumber(item.statistics.total_actions)}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
