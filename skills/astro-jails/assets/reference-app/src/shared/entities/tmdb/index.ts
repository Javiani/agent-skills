
export const TMDBEntity = ({

	name 			= String(),
	title 			= String(),
	poster_path 	= String(),
	genres 			= Array(),
	release_date 	= Date(),
	first_air_date 	= Date(),
	vote_average 	= Number(),
	images 			= { backdrops: [] },
	credits 		= { cast: [], crew: [] },
	...data

} = {} as any) => {

	return {
		...data,
		name,
		title		: title || name,
		images		: images.backdrops.slice(0, 9),
		crew		: credits.crew.slice(0,3),
		genres		: fmtGenres( genres ),
		vote_average: fmtVoteAverage( vote_average ),
		release_date: fmtDate( release_date ),
        poster_path	: fmtImage( poster_path ),
        cast		: fmtCast( credits.cast )
    }
}

/**
 * @Formatters
 */

const fmtDate = ( date: Date ) => {
	return new Date(date).toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

const fmtImage = ( path: string ) => {
	return path 
		? 'https://image.tmdb.org/t/p/w500' + path
		: 'https://via.placeholder.com/500x750'	
}

const fmtCast = ( cast: any[] ) => {
	return cast.slice(0, 5).map(c => ({
		...c,
		profile_path: fmtImage(c.profile_path)
	}))
}

const fmtGenres = ( genres : Array<any> ) => {
	return genres.map(g => g.name).join(', ')
}

const fmtVoteAverage = ( vote_average : number ) => {
	return (vote_average * 10).toFixed(2) + '%'
}