import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
    tls:{rejectUnauthorized:false},
    pool: true,
    maxConnections: 1,
    maxMessages: 5,
});



export async function sendMail(data:any) {
    try {
        let mailSent:any = { success: false };
        // if (process.env.ATHENA_MAIL_SEND_THROUGH === "SMTP") {
        console.log("sssssssssssssssss",data);
        
            mailSent = await sendThroughSMTP(data);
        // }
        return mailSent;
    } catch (error) {
        console.log("////", error)
    }

    // return {
    //   success: false,
    // };
}

function sendThroughSMTP(data, sendAs = "bulk_mail") {
    try {
        console.log("asdfgdsasdfedf",data);
        
        return new Promise(function (resolve, reject) {
            const messages = [];
            messages.push({
                from: process.env.ATHENA_MAIL_SENDER,
                to: data["email"],
                subject: data["subject"],
                // attachments: [{
                //     filename: "head.png",
                //     path: "../../assets/images/head.png",
                //     cid: "logo"
                // }],
                html: data["mailContent"]
            });

            while (transporter.isIdle() && messages.length) {
                transporter.sendMail(messages.shift(), (err, info) => {
                    if (err) {
                        console.log("mail error", err);
                    }
                    else {
                        console.log("infoooo", info);
                    }
                });
            }
        });
    } catch (error) {
        console.log("ddddddddddddd", error);
    }
}

// module.exports = sendMail;