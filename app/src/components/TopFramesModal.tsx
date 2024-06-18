import React, { useState, useEffect } from 'react'
import { Modal, Table } from 'react-bootstrap'
import { IPublicStataResponse, topStata } from '../service/api'

export function TopFramesModal({ show, handleClose }: { show: boolean; handleClose: () => void }) {
  const [stata, setStata] = useState<IPublicStataResponse | null>(null)

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const response = await topStata()
          setStata(response)
        } catch (e) {
          console.error(e)
        }
      }
      fetchData()
    }
  }, [show])

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={'lg'}
    >
      <Modal.Header closeButton>
        <Modal.Title>Top Frames</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {stata ? (
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Owner ID</th>
              <th>Frame ID</th>
              <th>Unique Visitors</th>
              <th>All Visitors</th>
            </tr>
            </thead>
            <tbody>
            {stata.sortedOwnerIds.map(ownerId => (
              Object.entries(stata.stata[ownerId]).map(([frameId, stats]) => (
                <tr key={`${ownerId}-${frameId}`}>
                  <td>{ownerId}</td>
                  <td>{frameId}</td>
                  <td>{stats.unique}</td>
                  <td>{stats.all}</td>
                </tr>
              ))
            ))}
            </tbody>
          </Table>
        ) : (
          <p>Loading...</p>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}
