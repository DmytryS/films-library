import React, { Component } from 'react';
import { Link } from 'react-router';
import { Panel, ListGroup, ListGroupItem} from 'react-bootstrap';

class FilmsList extends Component {
  componentWillMount() {
    this.props.fetchFilms({'sort-by':'title', 'sort-order': 'asc'});
  }

  renderFilms(films) {
    return films.map((film) =>
      <ListGroupItem key={film._id}>
        <Link to={`films/${film._id}`}>
          {film.title}
        </Link>
      </ListGroupItem>
    );
  }

  render() {
    const { films, loading, error } = this.props.filmsList;
    const {handleSubmit} = this.props;

    if(loading) {
      return <div><Panel><Panel.Heading>Films</Panel.Heading><Panel.Body>Loading...</Panel.Body></Panel></div>
    } else if(error) {
      return <div><Panel bsStyle="danger"><Panel.Heading>Error</Panel.Heading><Panel.Body>{error.message}</Panel.Body></Panel></div>
    }

    return (
      <div>
        <Panel>
          <Panel.Heading>
            Films
          </Panel.Heading>
          <ListGroup>
            {this.renderFilms(films)}
          </ListGroup>
        </Panel>
      </div>
    );
  }
}


export default FilmsList;
