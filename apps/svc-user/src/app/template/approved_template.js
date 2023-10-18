const approved_template = `
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
      <img 	src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/944605_929078/Mediamodifier-Design-Template%20%282%29.png" alt="Athena logo" style=" width:70px; margin-bottom:80px; margin-right:20px; ">
      <img 	src="https://b58b33703a.imgdist.com/public/users/Integrators/BeeProAgency/988432_973118/hh/MicrosoftTeams-image%20%282%29.png" alt="Approved logo" style="width:150px; margin-left:200px; margin-top:10px;">
    </div>
    <hr/>
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
    <div style="text-align: left; padding-left: 70px; padding-right: 50px;">
    <p style="margin-bottom:30px">Dear {{first_name}}&nbsp;{{last_name}},</p> <p style="margin-top: 50px;">The details of {{count}} employees that you uploaded have been approved and uploaded by {{approver_first_name}}&nbsp;{{approver_last_name}}.</p><br><p>You may have <a href="{{link}}">login<a> to view details or click following link to view details.</p>
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
        <a href = "{{host_url}}?token={{token}}" target=blank style="color:#fff">Go to Users</a>
        </button>
        </div>
    
    
    </div>
    </div>
    </body>
    </html>`;

module.exports = approved_template;