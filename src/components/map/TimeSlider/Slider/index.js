import React, { useEffect } from 'react'
import moment from 'moment';
import RangeSlider from 'react-bootstrap-range-slider';
// import '../../../CSS/style.css'
import ModalContainer from '../Modal';




const DateSlider = ({sliderValue, setSliderValue, endDate, startDate, setDateOnSlider, setStartDate, setEndDate }) => {

    const handleSliderChange = event => {
        setSliderValue(event.target.value);
    };
    useEffect(() => {
      const handleDate = ()=> {
        if(startDate){
            const date1 = new Date(startDate);
            const dateOnSlider =parseInt(date1.getTime()) + parseInt(sliderValue);
            console.log(dateOnSlider);
            const a = new Date(dateOnSlider);
            const b = a.toISOString()
            setDateOnSlider(b.slice(0, 10));
        }
        
    }
        handleDate()
    }, [ setDateOnSlider, sliderValue, startDate])
    
    
    const getMillisDiff = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start);
    };
    
    
  return (
    <div className="slider-container">
        <div style={{padding: "20px"}}>
            <ModalContainer
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            <RangeSlider
                style={{width:'300px' }} 
                min={0}
                max={endDate ? getMillisDiff(startDate, endDate) : 0}
                step={1}
                value={sliderValue}
                onChange={handleSliderChange}
            />
        </div>
        
    </div>
    
  )
}

export default DateSlider