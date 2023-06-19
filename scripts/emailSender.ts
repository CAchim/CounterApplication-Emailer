const fetchReceiversLib = require('./fetchReceivers')
const nodemailer = require('nodemailer');

export class EmailSender {
  emailTransporter
  emailSender: string = 'counterapplication@outlook.com'//'counterapp@yahoo.com'

  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: 'smtp.office365.com'/**'smtp.mail.yahoo.com'*/,
      port: 587,//465,
      service: 'office365',//'yahoo',
      secure: false,
      auth: {
        user: this.emailSender,
        pass: 'hcyyxszpwsqvtcmj',//'toulzvsvhnwnveaj',
      },
      debug: false,
      logger: true,
    })
  }

  async sendEmail(
    toParam: string,
    subjectParam: string,
    textParam: string,
    htmlParam: string,
  ) {
    const EmailBodyText =
      'In case you view this message you must enable HTML in your emailing software.\nThe following adapter needs your attention, please schedule a maintenance for it ASAP!\n' +
      textParam

    // if (!isEmailValid(this.To)) {
    //
    //   return;
    // }
    //const sqlCommand = "select * from Users where user_group = 'Manteinance'";
    //const egroup = queryDatabase(sqlCommand);
    const dbReceivers = await fetchReceiversLib.fetchReceivers()
    const receiversFromDB = JSON.stringify(dbReceivers.message)
    const tmp = receiversFromDB.slice(21)
    var index = tmp.indexOf("}")-1
    const tmp2 = tmp.slice(0,index)
    const finalReceiver = toParam.concat(';',tmp2)
    console.log(finalReceiver)

    const validEmails = parseEmailField(tmp2)//(finalReceiver)
    if (validEmails == '') {
      return false
    }

    await this.emailTransporter.sendMail({
      from: this.emailSender,
      to: validEmails,
      subject: subjectParam,
      text: EmailBodyText,
      html: htmlParam,
    })
    return true
  }
}

function isEmailValid(input: string) {
  let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  return input.match(validRegex) ? true : false
}

function parseEmailField(input: string): string {
  let emails: string[]

  if (!input.includes(';')) {
    if (isEmailValid(input)) {
      return input
    } else {
      console.log(new Date(),
        `Error: Target email is invalid: ${input}`,
      )
      return ''
    }
  } else {
    emails = input.split(';')
    let validEmails = emails.map((item) => {
      if (isEmailValid(item)) {
        console.log(`${item} is valid email`)
        return item
      } else {
        console.log(new Date(),
          `Error: Target email is invalid: ${item}`,
        )
        return null
      }
    })

    //filter all array to remove null objects and return the valid emails delimited by ;
    let validEmailsFiltered = validEmails.filter((n) => n)
    return validEmailsFiltered.join(';')
  }
}
