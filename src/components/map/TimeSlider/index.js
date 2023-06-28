import React, {useState, useEffect} from 'react'
import Map from "./Map";
import Slider from "./Slider";
import animalData from '../../../assets/animalData8.json'
import { Card } from 'react-bootstrap';
// import moment from 'moment';

const TimeSlider = () => {
    // const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [filteredData, setFilteredData] = useState([]);
    const [sliderValue, setSliderValue] = useState(0);
    const [dateOnSlider, setDateOnSlider] = useState('');

    useEffect(() => {
        setFilteredData(animalData);  
    }, []);


  return (
    <div className="content-wrapper">
        {/* Content Wrapper. Contains page content */}
        <div className="content-header">
            <section className="content">
                <div className='container-fluid'>
                    <Card className="text-center">
              <Card.Body style={{height: "500px", width: '100%'}} >
                    <Slider 
                    startDate={startDate} 
                    endDate={endDate}  
                    setStartDate={setStartDate} 
                    setEndDate={setEndDate} 
                    setSliderValue={setSliderValue} 
                    sliderValue={sliderValue}
                    setDateOnSlider={setDateOnSlider}
                />
                <Map 
                    filteredData={filteredData} 
                    dateOnSlider={dateOnSlider}
                />
                  </Card.Body>
              </Card>
                </div>
            </section>{/* /.container-fluid */}
        </div>
        {/* /.content */}
        {/* /.content-wrapper */}

    </div>
  )
}

export default TimeSlider