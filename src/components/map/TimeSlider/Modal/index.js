import React from 'react'
import {  Form } from 'react-bootstrap';

const ModalContainer = ({setEndDate, setStartDate, showModal, setShowModal, startDate, endDate}) => {
    const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();

  //   // setShowModal(false);
  // };
  // const handleModalClose = () => {
  //   setShowModal(false);
  // };
  return (
           <Form>
                <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control 
                    type="date"  
                    name='startDate' 
                    value={startDate}
                    onChange={handleStartDateChange}
                />
                </Form.Group>

                <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control 
                    type="date" 
                    name='endDate' 
                    value={endDate} 
                    onChange={handleEndDateChange}
                />
                </Form.Group>
            </Form>
  )
}

export default ModalContainer