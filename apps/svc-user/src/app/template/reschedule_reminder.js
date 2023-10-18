const reminder_schedule = `
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
</style>
</head>
<body>
<div class="container">
<div class="svgg">
<img src=" https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Mediamodifier-Design-Template%20%282%29.png" alt="Athena logo" style=" width:90px">
</div>
<div class="svgg"><img width="10px" height="10px" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Group%201%402x.png" alt="Athena title" style=" width:90px">
</div>
<h1>You have a schedule to attend</h1>
<hr/>
<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
<div style="text-align: left; padding-left: 50px; padding-right: 50px;">
<p >Hi,</p>
<p >Your scheduled booking has been rescheduled at {{startTime}}. Please be ready.</p></div><div style="text-align: left; padding-left: 140px;">
<p style=" margin-top: 50px; padding-left: 220px;color: grey;"> For any further assistance please  <a href="https://bassure.com/contact.html" style="color:#40A9FF"> contact </a> us.</p>
</div>
</div>
</body>
</html>`;
module.exports = reminder_schedule;
