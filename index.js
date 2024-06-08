import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminInfoModel from "./models/AdminInfoSchema.js";

//contact page form
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


export const Check =(req,res)=>{
  res.status(200).send("Subscribed Successfully:")
}

//footer subscribe
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

//http://localhost:4000/backend/adminsignup?Username=[username]&Password=[password]
export const adminSignup = (req,res) =>
{
  // username: admin
  // password: admin@xyma.in
  const {Username, Password} = req.query;
  bcrypt.hash(Password, 10)
  .then(hash => {
    AdminInfoModel.create({Username, Password: hash})
    .then(info => res.json(info))
    .catch(err => res.json(err))
  })
  .catch(error => console.log(error.message));
};

// admin login
export const adminLogin = (req,res) =>
{
  const {Username, Password} = req.body;
  console.log('username',Username);
  console.log('password',Password);
  AdminInfoModel.findOne({Username: Username})
  .then(user => {
    if(user) {
      bcrypt.compare(Password, user.Password, (err, response) => {
        if(response) {
          const redirectUrl = '/admin@2k24Portal';
          const token = jwt.sign({Username: user.Username}, 'jwt-secret-key', {expiresIn: '1d'});
          res.json({token: token, redirectUrl: redirectUrl});
        }
        else {
          res.json('incorrect password');
          console.log('incorrect password');
        }
      })
    }
    else {
      res.json('invalid user');
      console.log('invalid user');
    }
  })
  .catch(err => console.log(err));
};

//jwt token validation -> protected route
export const validateToken = (req,res) => {
  console.log('validation api triggered');
  const token = req.headers['authorization'];
  console.log('token',token);
  if(!token) 
    return  res.json({valid: false}) 
            console.log('invalid');

  jwt.verify(token, 'jwt-secret-key', (err, user) => {
    if(err) 
      return  res.json({valid: false});
              console.log("invalid");

    res.json({valid: true});
    console.log("valid");
  });
};