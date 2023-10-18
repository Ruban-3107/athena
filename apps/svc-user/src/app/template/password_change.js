// const password_change = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
//     <h1>Hi, {{user_name}}</h1><br>
//     <p>This mail is regarding your Athena password change request,please click on the below link to reset your password.The link expires in {{expiry}} minutes</p>
//     <p><a href = {{host_url}}?token={{token}}>password reset</a></p>
// </body>
// </html>
// `;

// module.exports = password_change;

const password_change = `
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Your Mail Title Here</title><style>body {
margin: 0;
padding: 0;
background-color: #f2f2f2;
}
.container {
max-width: 600px;
margin: 0 auto;
padding: 20px;
background-color: #ffffff;
text-align: center;
}
.svgg{
display: grid;
justify-content: center;
}
h1 {
color:  #000000;
}
</style></head><body><div class="container"><div class="svgg"><img src=" https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Mediamodifier-Design-Template%20%282%29.png" alt="Athena logo" style=" width:90px"></div><div class="svgg"><img width="10px" height="10px" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Group%201%402x.png" alt="Athena title" style=" width:90px">
</div><h1>Reset Password</h1><hr/><div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;"><div style="text-align: left; padding-left: 50px; padding-right: 50px;"><p >Dear {{user_name}},</p> <p style="margin-top: 35px;">We received you request to reset you Athena Password. To continue, please click the link below.</p> </div> <div style=" margin-top: 30px;"> <a href = "{{host_url}}?token={{token}}" target=blank style="color:#40A9FF" style="display: inline-block; background-color: #40A9FF;color: white; text-align: center; padding: 12px 230px; text-decoration: none; border-radius: 15px;">Reset Password</a> </div><div style="text-align: left; padding-left: 50px; padding-right: 50px;"><p style="margin-top: 35px;">If you didn't make this request, please disregard this mail. This link expires in {{expiry}} minutes.</p></div></div></div></body></html>`;
module.exports = password_change;