// const welcome_new_user = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>

// <div style="box-sizing: border-box; text-align: center; margin-top: 60px;">            <h1 className="header h1"style="box-sizing: border-box; color: #134097; font-family: 'Anton'; font-size: 40px; font-style: normal; font-weight: 400; letter-spacing: .03em; line-height: 60px; margin: 0;">              Welcome to ATHENA</h1>   <div style="box-sizing: border-box; width: 319px; height: 1px; margin: 10px auto; background: #FF8412;"> </div>

//     <h1>Dear, {{first_name}}&nbsp;{{last_name}} </h1><br>
//     <li className="text li"style="box-sizing: border-box; color: #134097; font-size: 14px; line-height: 19px; font-family: 'Open Sans'; font-style: normal;">                  <strong style="box-sizing: border-box;">Email:</strong> {{email}}</li>
//     <li className="text li"style="box-sizing: border-box; color: #134097; font-size: 14px; line-height: 19px; font-family: 'Open Sans'; font-style: normal;">                  <strong style="box-sizing: border-box;">Password:</strong> {{password}}</li> 

//     <div >  Click <a href="{{host_url}}" target=blank style="color:blue"> here </a> to login Athena</a> </div> </div>

// </body>
// </html>
// `;

// module.exports = welcome_new_user;

const new_user_created = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Your Mail Title Here</title>
<style>
body {
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
</style>
</head>
<body>
<div class="container">
<div class="svgg">
<img src=" https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Mediamodifier-Design-Template%20%282%29.png" alt="Athena logo" style=" width:90px">
</div>

<div class="svgg">
<img width="10px" height="10px" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Group%201%402x.png" alt="Athena title" style=" width:90px">
</div>

<h1>Welcome aboard</h1>
<hr/>
<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">


<div style="text-align: left; padding-left: 50px; padding-right: 50px;">
<p>Dear {{first_name}}&nbsp;{{last_name}},</p>
 <p style="margin-top: 35px;">We are thrilled to welcome you to Athena,the ultimate learning platform that provides you with limitless possibilities to expand your knowledge on skills and technologies.</p>
<p >Here is your login credentials:</p>

</div>

<div style="text-align: left; padding-left: 140px;">
<li className="text li"style=" margin-top: 30px; box-sizing: border-box; color: #134097; font-size: 14px; line-height: 19px; font-family: 'Open Sans'; font-style: normal;"> <strong style="box-sizing: border-box;" >Email:</strong> {{email}}</li>
<li className="text li"style="box-sizing: border-box; color: #134097; font-size: 14px; line-height: 19px; font-family: 'Open Sans'; font-style: normal;"> <strong style="box-sizing: border-box;">Password:</strong> {{password}}</li>
</div>


<div style=" margin-top: 30px;">
<a href="{{host_url}}" target=blank style="color:#40A9FF" style="display: inline-block; background-color: #40A9FF;color: white; text-align: center; padding: 12px 230px; text-decoration: none; border-radius: 15px;">Sign In</a>

</div>


<p style=" margin-top: 50px; padding-left: 220px;color: grey;"> For any further assistance please  <a href="https://bassure.com/contact.html" style="color:#40A9FF"> contact </a> us.</p>


</div>

</div>
</body>
</html>
`

module.exports = new_user_created;


