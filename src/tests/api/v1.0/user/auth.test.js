import { pgsqlQuery } from '#helpers/pgsql.helper';
import app from '../../../../app';

const request = require('supertest');

describe('User API', () => {
  it('should register a new user with valid credentials', async () => {
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
});
