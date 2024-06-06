import nodemailer from "nodemailer";

export const contacts = (req, res) => {
  //nodemailer with outlook
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.WEBSITE_EMAIL,
      pass: process.env.WEBSITE_EMAIL_PASS,
    },
  });

  const { name, email, job, company, solution, details } = req.body;

  const mailOptions = {
    from: process.env.WEBSITE_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `${name} contacted you through XYMA Website`,
    text: `Name: ${name}\nEmail: ${email}\nJob: ${job}\nCompany: ${company}\nSolution: ${solution}\nDetails: ${details}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent:" + info.response);
  });
};

export const subscription = (req, res) => {
  //nodemailer with outlook
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.WEBSITE_EMAIL,
      pass: process.env.WEBSITE_EMAIL_PASS,
    },
  });

  const { email } = req.body;

  const mailOptions = {
    from: process.env.WEBSITE_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `Subscription notification from XYMA Website`,
    text: `${email} subscribed to XYMA`,
  };

  const subscriptionMainOptions = {
    from: process.env.WEBSITE_EMAIL,
    to: email,
    subject: "Message from XYMA Analytics",
    text: `Hi, Thank you for subscribing to our Website`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    } else {
      res.status(200).send("Subscribed Successfully:" + info.response);
      transporter.sendMail(subscriptionMainOptions, (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        } else {
          res
            .status(200)
            .send("Subscription sent Successfully:" + info.response);
        }
      });
    }
  });
};
