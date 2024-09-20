const postmark = require('postmark');


const sendPostMarkEmail = (
    recipent, 
    data, 
    template,
    sender = {from_email: "adenirandaniel565@gmail.com", from_name: "LordCodex164"},
    attachments = [],
    additional_recipents = {},
    server_type = "first"
    ) => {
   console.log("rec", recipent)
   console.log("data", data)
   console.log("temp", template)
   let from,
       from_name = ""

    if("from_email" in sender){
        from = sender.from_email
    }
    if("from_name" in sender){
        from_name = sender.from_name
    }

    if(process.env.NODE_ENV !== "production"){
        if(process.env.NODE_ENV == "staging"){
            data = {
                ...data,
                environment: "STAGING"
            }
        }
        else {
            data = {
                ...data,
                environment: "Development"
            }
        }
    }

    const mailerObject = {
        From: from_name + "<" + from + ">",
        To: recipent,
        TemplateModel: {data},
        TemplateAlias: template,
        TemplateId: 1231,
        Metadata: {
            Color:"blue",
        },
        Attachments: attachments
    }

    if(additional_recipents["CC"] !== undefined) {
        mailerObject["CC"] = String(additional_recipents["CC"])
    }

    if(additional_recipents["BCC"] !== undefined) {
        mailerObject["CC"] = String(additional_recipents["CC"])
    }

    const api_key = process.env.POSTMARK_API_KEY

    const client = new postmark.ServerClient(api_key)

    client.sendEmailWithTemplate(mailerObject)
}

module.exports = sendPostMarkEmail