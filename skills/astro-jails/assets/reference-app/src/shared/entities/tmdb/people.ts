
export const TMDBPeopleEntity = ({
	
	combined_credits = { cast : [] },
	external_ids = Object(),
	...data

} = {}) => {
	
	const castMovies = combined_credits.cast || []
	const movies 	 = castMovies.sort((a, b) => b.popularity - a.popularity).slice(0, 5)
	const knownFor 	 = movies.map( KnownFor )
	const credits 	 = castMovies.map( Credits ).sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
	const { facebook_id, instagram_id, twitter_id, homepage } = external_ids

	return {
		...data,
		credits,
		knownFor,
		social: { facebook_id, instagram_id, twitter_id, homepage },
		person: Person( data )
	}
}

const Person = ({
	
	profile_path 	= String(),
	birthday 		= String(),
	name 			= String(),
	biography 		= String(),
	place_of_birth 	= String(),
	...data

} = {}) => {
	
	return {
		...data,
		name,
		place_of_birth,
		biography,
		profile_path: profile_path ? 'https://image.tmdb.org/t/p/w300/' + profile_path : 'https://via.placeholder.com/300x450',
		birthday	: fmtBirthday( birthday ),
    	age			: fmtAge( birthday )
	}
}

const KnownFor = ({

	id 			= String(),
	title 		= String(),
	name 		= String(),
	poster_path = String(),
	media_type 	= String(),
	...data

} = {}) => {

	return {
		...data,
		title		: title || name || 'Untitled',
		poster_path	: poster_path ? 'https://image.tmdb.org/t/p/w185/' + poster_path : 'https://via.placeholder.com/185x278',
		linkToPage	: media_type === 'movie' ? `/movies/${id}` : `/tv/${id}`
	}
}

const Credits = ({
	
	id 				= String(),
	title 			= String(),
	name 			= String(),
	release_date 	= String(),
	first_air_date 	= String(),
	media_type 		= String(),
	character 		= String(),
	...data

} = {}) => {

	return {
		...data,
		character,
		title		: title || name || 'Untitled',
		release_date: release_date || first_air_date || '',
		release_year: release_date ? release_date.split('-')[0] : 'Future',
		linkToPage	: media_type === 'movie' ? `/movies/${id}` : `/tv/${id}`
	}
}

/**
 * @Formatters
 */

const fmtAge = ( age: string ) => {
	const birthday = new Date( age )
	const ageDifMs = Date.now() - birthday
	const ageDate = new Date( ageDifMs )
	return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const fmtBirthday = ( birthday: string ) => {
	return new Date(birthday).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}