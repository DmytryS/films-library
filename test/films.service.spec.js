'use strict';

import should from 'should';
import sinon from 'sinon';
import assert from 'assert';
import App from '../app';
import FilmModel from '../models/filmModel';
import mocha from 'mocha';
import request from 'supertest-promised';

const configuration = {
  db: {
    url: 'mongodb://localhost/films-test'
  },
  port: 3000
};
let server;
const filmModel = new FilmModel();
const app = new App(configuration);



describe('FilmsService', () => {
  before(async () => {
    app.start();
    server = app.server;
  });

  after(async () => {
    app.stop();
  });

  beforeEach(async () => {
    await app.clearDb();
  });

  describe('AddFilm', () => {
    const filmObject = {
      title: 'Die Hard',
      year: 1988,
      format: 'VHS',
      stars: ['Bruce Willis', 'Alan Rickman']
    };

    it('should add new film to db', async () => {
      const response = await request(server)
        .put('/api/films')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(filmObject)
        .expect(200)
        .end()
        .get('body');
      delete response._id;
      delete response.__v;

      response.should.eql(filmObject);
    });
  });

  describe('DeleteFilm', () => {
    const filmObject = {
      title: 'Die Hard',
      year: 1988,
      format: 'VHS',
      stars: ['Bruce Willis', 'Alan Rickman']
    };
    let film;

    beforeEach(async () => {
      film = await filmModel.Film.saveFilm(filmObject);
    });

    it('should delete saved film', async () => {
      const response = await request(server)
        .delete(`/api/films/${film._id}`)
        .expect(204)
        .end();

      const deletedFilm = await filmModel.Film.findById(film._id);

      (deletedFilm === null).should.be.true()
    });
  });

  describe('GetFilm', () => {
    const filmObject = {
      title: 'Die Hard',
      year: 1988,
      format: 'VHS',
      stars: ['Bruce Willis', 'Alan Rickman']
    };
    let film;

    beforeEach(async () => {
      film = await filmModel.Film.saveFilm(filmObject);
    });

    it('should return saved film', async () => {
      const response = await request(server)
        .get(`/api/films/${film._id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end()
        .get('body');

      delete response._id;
      delete response.__v;

      response.should.eql(filmObject);
    });
  });

  describe('EditFilm', () => {
    const filmObject = {
      title: 'Die Hardddd',
      year: 1930,
      format: 'DVD',
      stars: ['Alan Rickman']
    };
    let film;

    beforeEach(async () => {
      film = await filmModel.Film.saveFilm(filmObject);
    });

    it('should edit saved film', async () => {
      const newFilmObject = {
        title: 'Die Hard',
        year: 1988,
        format: 'VHS',
        stars: ['Bruce Willis', 'Alan Rickman']
      };

      const response = await request(server)
        .post(`/api/films/${film._id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(newFilmObject)
        .expect(200)
        .end()
        .get('body');

      delete response._id;
      delete response.__v;

      response.should.eql(newFilmObject);
    });
  });

  describe('GetFilms', () => {
    const filmObject1 = {
      title: 'Die Hard',
      year: 1988,
      format: 'VHS',
      stars: ['Bruce Willis', 'Alan Rickman']
    };
    const filmObject2 = {
      title: 'Bad Boys',
      year: 1995,
      format: 'VHS',
      stars: ['Will Smith', 'Martin Lawrence']
    };

    beforeEach(async () => {
      await filmModel.Film.saveFilm(filmObject1);
      await filmModel.Film.saveFilm(filmObject2);
    });

    it('should return films list sorted by title', async () => {
      let response = await request(server)
        .get('/api/films?sort-by=title&sort-order=desc&limit=10')
        .set('Accept', 'application/json')
        .expect(200)
        .end()
        .get('body');

      response = response.map(film => {delete film._id;delete film.__v; return film});

      response.should.eql([filmObject1, filmObject2]);
    });

    it('should find films by title', async () => {
      const response = await request(server)
        .get('/api/films?title=Die%20Hard&limit=10' )
        .set('Accept', 'application/json')
        .expect(200)
        .end()
        .get('body');

      delete response[0]._id;
      delete response[0].__v;

      response.should.eql([filmObject1]);
    });

    it('should find films by actor', async () => {
      const response = await request(server)
        .get('/api/films?stars=Will%20Smith&limit=10')
        .set('Accept', 'application/json')
        .expect(200)
        .end()
        .get('body');

      delete response[0]._id;
      delete response[0].__v;

      response.should.eql([filmObject2]);
    });
  });
});