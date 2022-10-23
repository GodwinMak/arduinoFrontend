
import React, { useEffect, useContext } from 'react'
// import './animallist.css'
import Table from '../table/Table';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/appContext';

// Spinner for loading animation
import ClipLoader from "react-spinners/ClipLoader";


const AnimalList = () => {

    const {
        animalData, setAnimalData,
        animal_names, setAnimal_names,
        animal_name, setAnimal_name,
        setRhinoName,
        setLoading, loading
    } = useContext(AppContext); // user context from app.js 
    const navigate = useNavigate();

    // feching data from the database........
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            getAnimalData(
                (data) => {
                    setAnimalData(data);
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                }
            )
        }
        fetchData();
    }, [setAnimalData, setLoading]);

    const getAnimalData = async (cbsf, cbef) => {
        try {
            const response = await fetch(`https://gpsarduinoproject.herokuapp.com/api/v1/getdata`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            cbsf(data.data);
        } catch (error) {
            cbef(error);
        }
    };

    // taking rhinonames in order to make a list from data fetched from the data base
    useEffect(() => {
        setAnimal_names(animalData.map((data, _id) => {
            return data.objectName;
        }));

    }, [setAnimal_names, animalData]);

    //sorting and removing the redudunce from  names of rhinos
    useEffect(() => {
        setAnimal_name(animal_names.sort().filter((c, pos) => {
            return animal_names.indexOf(c) === pos;
        }))
    }, [setAnimal_name, animal_names]);

    // creacting list component in the dashboard
    const renderOrderBody = (item, index) => {
        const onClick = (event) => {
            event.preventDefault();
            let tempName = animalData.filter(data => data.objectName === item).map(datum => datum.objectName);
            setRhinoName(tempName.filter((c, pos) => { return tempName.indexOf(c) === pos; }));
            setAnimalData([]);
            navigate('/dashboard/map');
        }
        return (
            <tr key={index}>
                <td>{item}</td>
                <td>
                    <Button variant='success' onClick={(event) => onClick(event)}>View Location</Button>
                </td>
            </tr>
        )
    }

    return (
          <>
                        <div className='content-wrapper'>
                            <div className="content-header">
                            <div className='container-fluid'>
                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <h1 className="m-0">Dashboard</h1>
                                    </div>{/* /.col */}
                                </div>{/* /.row */}
                            </div>
                            {!loading ? 
                            <section className='content'>
                            <div className='container-fluid'>
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Animal List</h3>
                                    </div>
                                    <div className="card-body">
                                        <Table
                                            headerData={['Animal Name', 'Action']}
                                            bodyData={animal_name}
                                            renderBody={(item, index) => renderOrderBody(item, index)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>: <ClipLoader color={"#123abc"} loading={loading} size={150} />
                        }
                        </div>
                    </div> 
            
      </>
    )
}

export default AnimalList