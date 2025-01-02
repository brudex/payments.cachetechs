const db = require("../models/index");
const passport = require("passport");
const Joi = require("joi");
const debug = require("debug")("nla-app:account-controller");
const activityLogController = require("./activitylog.controller");
const uuid = require('uuid');
const bcrypt = require("bcryptjs");
const Controller = {};
module.exports = Controller;


Controller.loginView = (req, res) => {
  res.render("account/login", { title: "Login",layout:false});
};


Controller.loginPost = (req, res) => {
  console.log("Login Posted >>>",req.body);
  passport.authenticate("local", {
    successRedirect: "/overview",
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: "Invalid Email or password"
  })(req, res)
};

 
Controller.createUser = (req, res) => {
  res.render("create-user", { title: "Create User" ,layout:"layouts/layout" });
};


Controller.createUserPost = async (req, res) => {
  const schema = Joi.object({
    firstName: Joi.string().min(1).max(256).required(),
    lastName: Joi.string().min(1).max(256).required(),
    phone: Joi.string().min(1).max(256).required(),
    email: Joi.string().email().required(),
    fullName: Joi.string().optional(),
    password: Joi.string().required()
  });
  const payload = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    fullName : `${req.body.firstName} ${req.body.lastName}` ,
    phone : req.body.phone,
    email : req.body.email,
    password : req.body.password,
  }
  console.log("The register payload>>>",payload);
  const { error } = schema.validate(payload);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/register-admin");
  }
  //check if email exists
  payload.uuid=uuid.v4();
  const userExist = await db.AdminUser.findOne({where:{email:payload.email}});
  if (userExist){
    req.flash("error", "Email already exists");
    res.redirect("/register-admin")
  }
  const hashedPassword =  await db.AdminUser.hashPassword(payload.password);
  payload.password = hashedPassword;
  payload.roleTypes =[];
  await db.AdminUser.create(payload);
  activityLogController.saveVerificationLog("USER-VERIFICATION", req.user, payload);
  req.flash(
      "success",
      "Account successfully registered."
  );
  return res.redirect("/register-admin");
};


Controller.logout = (req, res) => {
  req.logout();
  res.redirect("/login");
};


Controller.forgotPasswordView = (req, res) => {
  res.render("account/forgot-password", {
    title: "Forgotten password",
    layout:false
  });
};


Controller.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const userExist = await User.findByEmail(email);
  debug(userExist);
  if (!userExist) {
     req.flash(
      "success",
      "We have sent an email with password reset instructions."
    );
    return res.redirect("/forgotpassword");
  }
  //db.AdminUser.sendResetPasswordMail(email, req);

  req.flash(
    "success",
    "We have sent you an email with password reset instructions."
  );
  res.redirect("/forgotpassword");
};

Controller.resetPassword = async (req, res) => {
  const schema = Joi.object({
     uuid:Joi.string().required(),
     password: Joi.string().min(6).max(256).required().label("Password"),
     confirm: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "passwords do not match" }),
  });
  const { error }  = schema.validate(req.body);
  if (error) {
     return res.json({status:"03",message:error.details[0].message});
  }
  const user = await db.AdminUser.findOne({where:{uuid:req.body.uuid}});
  if (!user) {
    return res.json({status:"03",message:"Invalid Account"});
  }
  const hashedPassword = await db.AdminUser.hashPassword(req.body.password);
  user.password = hashedPassword;
  await user.save();
  res.json({status:"00",message:"Password updated successfully"})
};


Controller.changePasswordView = (req, res) => {
  const { user } = req;
  res.render("account/change-password", {
    title: "Change Password",
    layout:"layouts/layout",
    user
  });
};

Controller.changePasswordPost = async (req, res) => {
  console.log("Change Password Posted >>>",req.body);
   const user = req.user;
   const schema = Joi.object({
    currentPassword: Joi.string().min(6).max(256).required(),
    password: Joi.string().min(6).max(256).required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "passwords do not match" }),
   });
    let { error } = schema.validate(req.body);
    if(error){
        req.flash("error", error.details[0].message);
        return res.redirect("/change-password");
    }
  if (!(req.body.password && req.body.password.length >= 6)) {
    req.flash("error", "Password length must be at least 6");
    return res.redirect("/change-password");
  }
  if (!(await bcrypt.compare(req.body.currentPassword, user.password))){
    req.flash("error", "Invalid current password");
    return res.redirect("/change-password");
  }
  const hashedPassword = await db.AdminUser.hashPassword(req.body.password);
  await db.AdminUser.update({ password: hashedPassword }, { where: { uuid: user.uuid } });
  req.flash("success", "Password Change Successful");
  res.redirect("/change-password");
};

Controller.editAccountView = (req, res) => {
  const { user } = req;
  res.render("account/edit-account", {
    title: "Edit Account",
    values: user,
    user,
  });
};

Controller.editAccount = async (req, res) => {
  const { id } = req.user;
  const { firstName, lastName, email } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().min(1).max(256).required(),
    lastName: Joi.string().min(1).max(256).required(),
    email: Joi.string().email().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    req.flash("error", error.details[0].message);
    return res.redirect("/account/edit-account");
  }

  const user = await User.findOne({ where: { id } });

  if (!user) {
    req.flash("error", "User not found!");
    return res.redirect("/account/edit-account");
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  await user.save();

  req.session.passport.user.firstName = firstName;
  req.session.passport.user.lastName = lastName;
  req.session.passport.user.email = email;
  req.session.save(function (err) {
    req.flash("error", "Something went wrong");
    debug(err);
  });

  req.flash("success", "Account details updated succesfully");
  res.redirect("/account/edit-account");
};

Controller.logout = (req, res) => {
    req.logout();
    res.redirect("/login");
}

module.exports = Controller;
