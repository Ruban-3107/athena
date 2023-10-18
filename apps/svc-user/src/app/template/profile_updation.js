const profile_updation =
`
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Your Mail Title Here</title><style>body {
    margin: 0;
    padding: 0;
    background-color: #ffff;
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
    margin-right:40rem;
    }
    .svgg1{
    display: grid;
    justify-content: left;
    }
    .svgg2{
    position:absolute;
    display: grid;
    justify-content: center;
    padding:20px;
    margin-right:auto;
    }
    h1 {
    color:  #000000;
    }
    </style>
    </head>
    <body>
    <div class="img-container">
    <div class="svgg"><img src=" https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Mediamodifier-Design-Template%20%282%29.png" alt="Athena logo" style=" width:60px"></div>
    <div class="svgg"><img width="10px" height="10px" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Group%201%402x.png" alt="Athena title" style=" width:90px"></div>
      <img 	src="" alt="profile_updation_logo" style="width:190px; margin-left:270px; margin-top:10px;">
    <hr/>
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
    <div style="text-align: left; padding-left: 70px; padding-right: 50px;">
    <p style="margin-bottom:30px">Hello {{first_name}}&nbsp;{{last_name}}!,</p> <p style="margin-top: 50px;">Please update your profile details and fill all the details.</p><br><p>You may <a href="{{link}}">login<a> to view details or click following link to view details.</p>
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
        <a href = "{{host_url}}?token={{token}}" target=blank style="color:#fff">Go To Profile</a>
        </button>
        </div>
    
    </div>
    </div>
    </div>
    </body>
    </html>

`
module.exports = profile_updation;