import { pgsqlQuery } from '#helpers/pgsql.helper';
import app from '../../../../app';

const request = require('supertest');

describe('User API', () => {
  it('should REGISTER a new user with valid credentials', async () => {
    const response = await request(app).post('/api/v1.0/auth/register').send({
      email: 'shantanu.20.mane@gmail.com',
      password: 'Password@2002',
      role: 'user',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('REGISTRATION_SUCCESSFUL');

    pgsqlQuery('DELETE FROM core_users WHERE email = $1', [
      'shantanu.20.mane@gmail.com',
    ]);
  });

  it('should NOT REGISTER a new user if user already exists', async () => {
    const response = await request(app).post('/api/v1.0/auth/register').send({
      email: 'maneshantanu.20@gmail.com',
      password: 'Password@2002',
      role: 'user',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('USER_ALREADY_EXISTS');
  });

  it('should LOGIN an existing user with valid credentials', async () => {
    const response = await request(app).post('/api/v1.0/auth/login').send({
      email: 'maneshantanu.20@gmail.com',
      password: 'Shantanu@2002',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('LOGIN_SUCCESSFUL');
    expect(response.body.data).toHaveProperty('token');
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
  });

  it("should NOT LOGIN a new user who hasn't registered", async () => {
    const response = await request(app).post('/api/v1.0/auth/login').send({
      email: 'shantanu.mane.200@gmail.com',
      password: 'Shantanu@2002',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('USER_NOT_FOUND');
  });

  it('should NOT LOGIN an existing user with invalid credentials', async () => {
    const response = await request(app).post('/api/v1.0/auth/login').send({
      email: 'maneshantanu.20@gmail.com',
      password: 'Password@2002',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('INVALID_CREDENTIALS');
  });

  it('should REFRESH TOKEN for a logged in user', async () => {
    const loginResponse = await request(app).post('/api/v1.0/auth/login').send({
      email: 'maneshantanu.20@gmail.com',
      password: 'Shantanu@2002',
    });

    const refreshToken = loginResponse.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

    const response = await request(app)
        .post('/api/v1.0/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('TOKEN_REFRESHED');
    expect(response.body.data).toHaveProperty('token');
    expect(response.headers['set-cookie'][0]).toContain('refreshToken');
  });

  it('should NOT REFRESH TOKEN for a user who is not logged in', async () => {
    const response = await request(app).post('/api/v1.0/auth/refresh');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('INVALID_REFRESH_TOKEN');
  });
});
