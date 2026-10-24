import { TMDBEntity } from 'shared/entities/tmdb'
import { TMDBPeopleEntity } from 'shared/entities/tmdb/people'

import { http } from './http'

export const getTMDB = async ( url: string ) => {
    const data = await http.get( url )
    return TMDBEntity( data )
}

export const getTMDBList = async ( url: string ) => { 
    const data = await http.get( url )
    return data.results.map( TMDBEntity ) 
}

export const getPeopleDetails = async ( url: string ) => {
    const data = await http.get( url )
    return TMDBPeopleEntity( data )
}