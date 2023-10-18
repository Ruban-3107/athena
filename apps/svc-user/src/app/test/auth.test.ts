import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import AuthRoute from '../route/auth.route';
let otp;
let resetPasswordToken;
let jwtAccessToken;
describe('[POST] /api/users/signUp', () => {
  let app: App;
  let rolesRoute: AuthRoute;

  beforeAll(() => {
    rolesRoute = new AuthRoute();
    app = new App([rolesRoute]);
  });

  it('should create a user', async () => {
    const reqBody = {
      email: 'tes36t@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '+91 7772777777',
    };

    const response = await request(app.getServer())
      .post('/api/users/signUp')
      .send(reqBody);
    console.log(response, '---oooo---rdsdedssdsfdsred');

    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
  });

  it('should handle user already exists', async () => {
    const reqBody = {
      email: 'test47@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '+91 7777717777',
    };

    // Create a user first
    await request(app.getServer()).post('/api/users/signUp').send(reqBody);

    const response = await request(app.getServer())
      .post('/api/users/signUp')
      .send(reqBody);
    console.log(response, '----sfdef');

    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
  });

  it('should handle invalid URL', async () => {
    const reqBody = {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '+91 7777777777',
    };

    const response = await request(app.getServer())
      .post('/api/users/crweateRoles')
      .send(reqBody);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
  });
});
describe('[POST] /api/users/signIn', () => {
  let app: App;
  let authRoute: AuthRoute;

  beforeAll(() => {
    authRoute = new AuthRoute();
    app = new App([authRoute]);
  });

  it('should sign in successfully', async () => {
    const reqBody = {
      email: 'superadmin@yopmail.com',
      password: 'GH1VRWfD',
    };
    const response = await request(app.getServer())
      .post('/api/users/signIn')
      .send(reqBody);
    jwtAccessToken = response.body.body.value.access_token;
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
  });

  it('should handle invalid credentials', async () => {
    const reqBody = {
      email: 'test@example.com',
      password: 'wrongPassword',
    };

    const response = await request(app.getServer())
      .post('/api/users/signIn')
      .send(reqBody);

    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
  });

  it('should handle missing email', async () => {
    const reqBody = {
      password: 'password123',
    };

    const response = await request(app.getServer())
      .post('/api/users/signIn')
      .send(reqBody);

    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
  });

  it('password must be a string', async () => {
    const reqBody = {
      email: 'test@example.com',
      password: 12344,
    };

    const response = await request(app.getServer())
      .post('/api/users/signIn')
      .send(reqBody);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
  });
});
describe('[POST] /api/users/sendOtp', () => {
  let app: App;
  let authRoute: AuthRoute;

  beforeAll(() => {
    authRoute = new AuthRoute();
    app = new App([authRoute]);
  });

  it('should send OTP to email', async () => {
    // Mock the request body
    const reqBody = {
      input: 'mentor@yopmail.com',
      is_admin_app: false,
    };
    const response = await request(app.getServer())
      .post('/api/users/sendOtp')
      .send(reqBody);
    console.log(response.body.value, '----responee---');
    otp = response.body.body.value;
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
  });

  it('should send OTP to phone number', async () => {
    // Mock the request body
    const reqBody = {
      input: '7989431224',
      is_admin_app: true,
    };
    const response = await request(app.getServer())
      .post('/api/users/sendOtp')
      .send(reqBody);
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
  });

  it('phone number not registered', async () => {
    // Mock the request body with an invalid email
    const reqBody = {
      input: '0000000000',
      is_admin_app: false,
    };
    const errorMessage = `This mobile number ${reqBody.input} not yet registered`;
    const response = await request(app.getServer())
      .post('/api/users/sendOtp')
      .send(reqBody);
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe(errorMessage);
  });
  it('email not registered', async () => {
    // Mock the request body with an invalid email
    const reqBody = {
      input: 'nonexistingemail@gmail.com',
      is_admin_app: false,
    };
    const errorMessage = `This email ${reqBody.input} not yet registered`;
    const response = await request(app.getServer())
      .post('/api/users/sendOtp')
      .send(reqBody);
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe(errorMessage);
  });

  it('should handle password not changed', async () => {
    // Mock the request body with an email that has not changed the password
    const reqBody = {
      input: 'tes34t@example.com',
      is_admin_app: false,
    };

    // Mock the authService.sendOtp function to throw an error
    const errorMessage =
      'Please check your email and change the password first';
    const response = await request(app.getServer())
      .post('/api/users/sendOtp')
      .send(reqBody);
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe(errorMessage);
  });

  it('should handle missing input', async () => {
    // Mock the request body without the input field
    const reqBody = {
      is_admin_app: false,
    };

    const response = await request(app.getServer())
      .post('/api/users/sendOtp')
      .send(reqBody);

    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('Missing input');
  });
});
describe('[POST] /api/users/verifyOtp', () => {
  let app: App;
  let authRoute: AuthRoute;

  beforeAll(() => {
    authRoute = new AuthRoute();
    app = new App([authRoute]);
  });

  it('should verify OTP for email successfully', async () => {
    const reqBody = {
      input: 'mentor@yopmail.com',
      otp: otp,
    };
    const response = await request(app.getServer())
      .post('/api/users/verifyOtp')
      .send(reqBody);
    console.log(response, 'ppppp');

    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
    expect(response.body.body.message).toBe('OTP verified');
  });

  it('should verify OTP for phone number successfully', async () => {
    const reqBody = {
      input: '+1234567890',
      otp: 2132,
    };
    const response = await request(app.getServer())
      .post('/api/users/verifyOtp')
      .send(reqBody);
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
    expect(response.body.body.message).toBe('OTP verified');
  });

  it('should handle missing input', async () => {
    const reqBody = {
      otp: 2132,
    };

    const response = await request(app.getServer())
      .post('/api/users/verifyOtp')
      .send(reqBody);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('Missing input');
  });

  it('should handle missing OTP', async () => {
    const reqBody = {
      input: 'user@example.com',
    };
    const response = await request(app.getServer())
      .post('/api/users/verifyOtp')
      .send(reqBody);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('Missing otp');
  });
});
describe('[PUT] /api/users/forgotPassword', () => {
  let app: App;
  let authRoute: AuthRoute;
  beforeAll(() => {
    authRoute = new AuthRoute();
    app = new App([authRoute]);
  });

  it('should send password reset link successfully', async () => {
    const reqBody = {
      email: 'mentor@yopmail.com',
    };
    const response = await request(app.getServer())
      .put('/api/users/forgotPassword')
      .send(reqBody);
    resetPasswordToken = response.body.body.value;
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
    expect(response.body.body.message).toBe(
      'Password link has been sent to your email successfully'
    );
  });

  it('should handle missing email', async () => {
    const reqBody = {
      // email is missing
    };

    const response = await request(app.getServer())
      .put('/api/users/forgotPassword')
      .send(reqBody);

    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('Missing input');
  });

  it('should handle non-existent user', async () => {
    const reqBody = {
      email: 'nonexistent@example.com',
    };

    const response = await request(app.getServer())
      .put('/api/users/forgotPassword')
      .send(reqBody);

    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe("User doesn't exist");
  });
});

describe('[POST] /api/users/resetPassword', () => {
  let app: App;
  let authRoute: AuthRoute;

  beforeAll(() => {
    authRoute = new AuthRoute();
    app = new App([authRoute]);
  });

  it('should reset password successfully', async () => {
    // Mock the request body
    const reqBody = {
      token: resetPasswordToken,
      confirmPassword: 'newPassword123',
    };

    // Send the request
    const response = await request(app.getServer())
      .post('/api/users/resetPassword')
      .send(reqBody);
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
  });

  it('should handle invalid token', async () => {
    // Mock the request body
    const reqBody = {
      token: 'invalidResetToken',
      confirmPassword: 'newPassword123',
    };

    // Send the request
    const response = await request(app.getServer())
      .post('/api/users/resetPassword')
      .send(reqBody);

    // Assertions
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('jwt malformed');
  });

  it('should handle missing token', async () => {
    // Mock the request body
    const reqBody = {
      confirmPassword: 'newPassword123',
    };

    // Send the request
    const response = await request(app.getServer())
      .post('/api/users/resetPassword')
      .send(reqBody);

    // Assertions
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('Token missing');
  });

  it('expired token', async () => {
    // Mock the request body
    const reqBody = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxIiwiaWF0IjoxNjg2NjUxMTg4LCJleHAiOjE2ODY2NTE0ODh9.hqKFTXjcqALwfziRgD-P1QzCch4WxfBPVjWDImpT2Uw',
      confirmPassword: 'newPassword123',
    };
    // Send the request
    const response = await request(app.getServer())
      .post('/api/users/resetPassword')
      .send(reqBody);

    // Assertions
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('jwt expired');
  });
});

describe('[POST] /api/users/setPassword', () => {
  let app: App;
  let authRoute: AuthRoute;

  beforeAll(() => {
    authRoute = new AuthRoute();
    app = new App([authRoute]);
  });

  it('should set password successfully', async () => {
    // Mock the request body
    const reqBody = {
      old_password: 'Clem980509*',
      password: 'Clem980509*',
      confirm_password: 'Clem980509*',
    };

    // Send the request
    const response = await request(app.getServer())
      .post('/api/users/setPassword')
      .send(reqBody)
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2IiwibmFtZSI6InN1cGVyIGFkbWluIHlvcCB1c2VyIiwiZW1haWwiOiJzdXBlcmFkbWluQHlvcG1haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiOTYwMDkxODA5MCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wibWFuYWdlXCJdLFwic3ViamVjdFwiOlwiYWxsXCJ9XSIsImlkIjoiMiIsIm5hbWUiOiJTdXBlciBBZG1pbiIsImNyZWF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVzZXJfcm9sZXMiOnsiY3JlYXRlZEF0IjoiMjAyMy0wNi0yMlQwNjowODozMi44NjZaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yMlQwNjowODozMi44NjZaIiwidXNlcklkIjoiNTYiLCJSb2xlSWQiOiIyIn19XSwiZmlyc3RfbmFtZSI6InN1cGVyIGFkbWluIHlvcCIsImxhc3RfbmFtZSI6InVzZXIiLCJoYW5kbGUiOiJzdXBlcmFkbWluX1pNbmYiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4ODAyMDc1OSwiZXhwIjoxNjg5ODIwNzU5fQ.uag5B95_WKmp-X1JhGm0tLmP9b0Br7vLUnYdQ7iLIZ8`,
        CHECK_WITH_CUSTOM_USER: true,
      });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('600');
    expect(response.body.body.status).toBe('success');
  });

  it('should handle invalid token', async () => {
    // Mock the request body
    const reqBody = {
      old_password: 'Clem980509*',
      password: 'Clem980509*',
      confirm_password: 'Clem980509*',
    };

    // Send the request
    const response = await request(app.getServer())
      .post('/api/users/setPassword')
      .send(reqBody);

    // Assertions
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('Unauthorized');
  });

  it('confirm password not matching', async () => {
    // Mock the request body
    const reqBody = {
      old_password: 'Clem980509*',
      password: 'Clem980509*',
      confirm_password: 'Clem980109*',
    };

    // Send the request
    const response = await request(app.getServer())
      .post('/api/users/setPassword')
      .send(reqBody)
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2IiwibmFtZSI6InN1cGVyIGFkbWluIHlvcCB1c2VyIiwiZW1haWwiOiJzdXBlcmFkbWluQHlvcG1haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiOTYwMDkxODA5MCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wibWFuYWdlXCJdLFwic3ViamVjdFwiOlwiYWxsXCJ9XSIsImlkIjoiMiIsIm5hbWUiOiJTdXBlciBBZG1pbiIsImNyZWF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVzZXJfcm9sZXMiOnsiY3JlYXRlZEF0IjoiMjAyMy0wNi0yMlQwNjowODozMi44NjZaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yMlQwNjowODozMi44NjZaIiwidXNlcklkIjoiNTYiLCJSb2xlSWQiOiIyIn19XSwiZmlyc3RfbmFtZSI6InN1cGVyIGFkbWluIHlvcCIsImxhc3RfbmFtZSI6InVzZXIiLCJoYW5kbGUiOiJzdXBlcmFkbWluX1pNbmYiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4ODAyMDc1OSwiZXhwIjoxNjg5ODIwNzU5fQ.uag5B95_WKmp-X1JhGm0tLmP9b0Br7vLUnYdQ7iLIZ8`,
        CHECK_WITH_CUSTOM_USER: true,
      });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.body.code).toBe('611');
    expect(response.body.body.status).toBe('error');
    expect(response.body.body.message).toBe('confirm password not matching');
  });
});
