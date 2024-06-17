import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminInfoModel from "./models/AdminInfoSchema.js";
import PositionModel from "./models/PositionSchema.js";
import ApplicationFormModel from "./models/ApplicationFormSchema.js";

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
        }
      })
    }
    else {
      res.json('invalid user');
    }
  })
  .catch(err => console.log(err));
};

//jwt token validation -> protected route -> admin portal
export const validateToken = (req,res) => {
  const token = req.headers['authorization'];
  if(!token) 
    return  res.json({valid: false}) 

  jwt.verify(token, 'jwt-secret-key', (err, user) => {
    if(err) 
      return  res.json({valid: false});

    res.json({valid: true});
  });
};

//add position
export const addPosition = (req,res) => {
  const {DeptName, PositionName, PositionDesc, date} = req.body;
  PositionModel.create({DepartmentName: DeptName, Position: PositionName, PositionDescription: PositionDesc, LastDate: date })
  .then(info => res.json(info))
  .catch(err => res.json(err));
}

//get position
export const getPosition = (req,res) => {
  PositionModel.find()
  .then(positions => res.json(positions))
  .catch(err => res.status(500).json(err));
}

//delete position
export const deletePosition = (req,res) => {
  const {id} = req.params;
  PositionModel.findByIdAndDelete(id)
  .then(() => {
    res.json({message: 'Position Deleted Successfully'});
  })
  .catch((err) => {
    res.status(500).json({error: err.message});
  });
};

// update position
export const updatePosition = (req,res) => {
  const {PositionName, PositionDesc, LastDate} = req.body;
  const {id} = req.params;
  PositionModel.findByIdAndUpdate(id, {Position: PositionName, PositionDescription: PositionDesc, LastDate: LastDate}, { new: true })
  .then((updatedPosition) => {
    if(!updatedPosition) {
      return res.status(404).json({error : 'Position not found'});
    }
    res.json({message: 'Position updated successfully', updatedPosition});
  })
  .catch((error) => {
    res.status(500).json({error: error.message});
  });
};

//add application form in careers to db
export const uploadApplicationForm = (req,res) => {

  const {Name, Email, Phone, LinkedIn, ExpectedSalary, PrevJobCompany, PrevJobTitle, SelfIntro, WhyIntrested, YourExpectations, OurExpectations, Relocate, StartDate, ApplyingForDepartment, ApplyingForPosition} = req.body;
  const { buffer } = req.file
  ApplicationFormModel.create({
    Name,
    Email,
    Phone,
    LinkedIn,
    ExpectedSalary,
    PrevJobCompany,
    PrevJobTitle,
    SelfIntro,
    WhyIntrested,
    YourExpectations,
    OurExpectations,
    Relocate,
    StartDate,
    Resume: {
      data: buffer,
      contentType: "application/pdf",
    },
    ApplyingForDepartment,
    ApplyingForPosition,
  })
    .then((pdf) => {
      res.status(200).send("Application form saved successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving appllication form");
    });
};

// get application forms
export const getApplicationForm = (req,res) => {
  ApplicationFormModel.find()
    .then((applicationForms) => res.json(applicationForms))
    .catch((err) => res.status(500).json(err));
}
