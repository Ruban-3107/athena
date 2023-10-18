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
<p style="margin-bottom:30px">Hello {{name}}!,</p><p style="margin-bottom:5px">Hurry Up!,</p> <p style="margin-top: 5px;">The Training session on {{topic_name}} on {{date}} from {{start_time}} and {{end_time}} is starting in 15mins.</p><br><p>You may <a href="{{link}}">login<a>to view schedule details or click following link to go to schedule.</p>

</div>
<div style=" margin-top: 30px;"> 
        <button type="button" 
        style="  
        width: 84%;
        border-radius: 16px !important;
        background: #40a9ff !important;
        color: #fff !important;
        margin-left: 55px;
        border: hidden;
        padding: 0.7em;"
        >
        <a href = "{{host_url}}" target=blank style="color:#fff">Join the Session</a>
        </button>
        </div>
</body>
</html>`;
module.exports = reminder_schedule;
