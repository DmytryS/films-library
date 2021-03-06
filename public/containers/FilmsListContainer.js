import { connect } from 'react-redux'
import { fetchFilms, fetchFilmsSuccess, fetchFilmssFailure } from '../actions/films';
import FilmsList from '../components/FilmsList';


const mapStateToProps = (state) => {
  return {
    filmsList: state.films.filmsList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFilms: (queryParams) => {
      dispatch(fetchFilms(queryParams)).then((response) => {
        !response.error ? dispatch(fetchFilmsSuccess(response.payload.data)) : dispatch(fetchFilmsFailure(response.payload.data));
      });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FilmsList);