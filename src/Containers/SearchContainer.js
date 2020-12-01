import React from 'react'
import { Route, Switch} from 'react-router-dom'
import SearchForm from '../Components/SearchForm'
import PlantCard from '../Components/PlantCard'
import PlantProfile from '../Containers/PlantProfile'

import Modal from '../Components/Modal'


class SearchContainer extends React.Component {

    state = {
        queryResults: [],
        visibleModal: false,
        modalPlant: "",
        stagingArray: []
    }
    
    renderModal = (plantSlug) => {
        this.setState({visibleModal: true, modalPlant: plantSlug})
    }
    
    hideModal = () => {
        this.setState({visibleModal: false, modalPlant: ""})
    }

    searchHandler = (query) => {
        const token = localStorage.getItem("token")
        fetch(`http://localhost:3000/api/v1/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(resp => resp.json())
        .then(apiResponse => {
            this.setState({queryResults: apiResponse.api_data.data})
        })
    }
    
    renderPlantResults = () => {
        return this.state.queryResults.map(plant => 
            <PlantCard
                key={plant.id}
                plant={plant}
                renderModal={this.renderModal}
                handlePlantStaging={this.handlePlantStaging}
            />
        )
    }
    
    handlePlantStaging = (plantObj) => {
        let stagingArray = this.state.stagingArray
        if (!stagingArray.includes(plantObj)) {
            stagingArray = stagingArray.concat(plantObj)
            this.setState({stagingArray})
        } else {
            stagingArray = stagingArray.filter(plant => plant !== plantObj)
            this.setState({stagingArray})
        }
    }
    
    addPlantsToCollection = () => {
        const plantArray = this.state.stagingArray
        console.log(plantArray)
        plantArray.each(plant => {
            console.log("FEEDING INTO DB")
            // feed plant into PlantDB
            // feed plantID from response into UserPlant with User ID
            
        })
    }
    
    render() {
        return(
            <div className="search-container">
                <div className="search-filters">
                    <h1>Search</h1>
                    {this.props.user ? <SearchForm searchHandler={this.searchHandler}/> : <p>Please log in</p>}
                </div>
                {this.state.visibleModal ? <Modal plant={this.state.modalPlant} hideModal={this.hideModal} /> : null }
                
                {this.state.stagingArray.length > 0 ? <button onClick={this.addPlantsToCollection}>ADD ALL TO COLLECTION</button> : null}
                
                <Switch>
                    {/* <Route path="/search/:apiSlug" render={({match}) => {
                            return <div className="plant-profile-div">
                                <PlantProfile slug={match.params.apiSlug} />
                            </div>
                        }
                    }/> */}
                    <Route path="/search" render={ () => {
                        return <div className="search-results-div">
                            {this.renderPlantResults()}
                        </div>
                    }} />
                </Switch>
            </div>
        )
    }
}

export default SearchContainer