const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const { SchemaClient } = require("../model/database"); 
const { SchemaUser } = require("../model/UserDB");
const { SchemaTeam } = require("../model/TeamDB");  
const {SchemaReclamation} = require("../model/ReclamationDB"); 
const {SchemaMessage} = require("../model/messageDB"); 
const AdminDb = mongoose.connection.collection("admin");
const ReclamationDb = mongoose.connection.collection("reclamation");
const multer = require('multer');
const storage = multer.memoryStorage(); // باش نخلي الصورة في الذاكرة
const upload = multer({ storage: storage });
const crypto = require('crypto');



const SendEmailFunction = require("../utils/SendEmail");
const { Console } = require("console");


async function hashPassword(password) {
  if (!password) {
      console.error("❌ خطأ: كلمة المرور غير موجودة");
      return null; // تجنب إرجاع undefined
  }

  try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds); // 🔥 إرجاع القيمة بعد التشفير
  } catch (err) {
      console.error("❌ خطأ أثناء التشفير:", err);
      return null;
  }
}
//forget password
async function forget_password(req, res) {
  //get user by email
  const email = req.body.email;
  req.session.clientEmail = email;
  console.log(email)
  const user = await SchemaClient.findOne({email});
  if(!user){
    return res.status(404).json({ message: "the account not exists"});
  }
  //if user exist generate hash reset random 6 digits and save
  const code = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const hashCode = crypto
    .createHash('sha256')
    .update(code)
    .digest('hex')
  user.hashCode = hashCode;
  //add time for code (10 min)
  user.timeCode = Date.now() + 10 * 60 * 1000;
  user.verifiedCode = false;

  await user.save();

  const message = `Hi ${user.username}\n We recived a request to rest the password on your ADE (Algerian waters - Unite Ain Defla) Account.\n ${code} \n Enter this code to complete the reset.\n
  Thanks for helping us keep your account secure. \n The ADE (Algerian waters - Unite Ain Defla) Team`
  //send the rest code in email
  try {
    await SendEmailFunction({
      email: user.email,
      subject: 'Your password reset code (valide for 10 min)',
      message: message,
    })
    return res.status(200).json({ message: "code sent to email"});
  } catch (err) {
    user.hashCode = undefined;
    user.timeCode = undefined;
    user.verifiedCode = undefined;
    await user.save();
    console.log({ message: err})
    return res.status(500).json({ message: err});
  }
}

//verify reset code
async function verifyResetCode(req, res) {
  //get reset code
  const hashCode = crypto
    .createHash('sha256')
    .update(req.body.code)
    .digest('hex')

  const user = await SchemaClient.findOne({email: req.session.clientEmail});
  
  if(!( user.hashCode == hashCode && user.timeCode > Date.now()) ){
    return res.status(404).json({ message: "Reset code invalide or expired"});
  }
  //reset code valid
  user.verifiedCode = true;
  user.save();
  return res.status(200).json({ message: "Reset code valide"});
}

//reset password
async function reset_password(req, res) {
  //get user by email 
  const user = await SchemaClient.findOne({email: req.session.clientEmail});

  if(!user.verifiedCode){
    return res.status(400).json({ message: "Reset code not verified"});
  } 
  //user valide, update user password
  user.password = req.body.newPass;
  user.hashCode = undefined;
  user.timeCode = undefined;
  user.verifiedCode = undefined;
  user.save();
  return res.status(200).json({ message: "Update password"});
}

//create count client
async function create_account(req, res){
  console.log("📥البيانات ة:", req.body);
    //const account = new SchemaClient({ id: 1, username: "meriam", email: "be2430423", password: "1234" });
    const { username, email, password } = req.body;
    console.log(req.body);
    const id = `client${Math.floor(Math.random() * 100000)}`;
    /*const hashedPassword = await hashPassword(password) ;
    console.log("PASS", hashedPassword);*/
    const account = new SchemaClient({ id, username, email, password});
    account
      .save()
      .then((result) => res.status(201).json(result))
      .catch((err) => res.status(400).json({ message: err.message }));
  };

//login client
  async function login_account(req,res){
    console.log("📥البيانات ة:", req.body);
    const { username,password } = req.body;
    try{
      const user = await SchemaClient.findOne({ username});
      if (!user) {
        console.log("the account not exists");
        return res.status(401).json({ message: "the account not exists" });
      }
    if (password != user.password) {
      console.log("the account not exists");
        return res.status(401).json({ message: "the account not exists" });
    }
      console.log("the account exists");
      const userId = user._id;
      req.session.clientId = userId;
      console.log(req.session.clientId);
      return res.status(201).json({ message:"the account exists"});
    }catch (err) {
      console.log("err:", err.message);
      return res.status(500).json({ message: "حدث خطأ في السيرفر" });
  }
}

//delet user (Admin)
async function delet_user(req, res){
  const iduser = req.params.iduser;
  SchemaTeam.findByIdAndDelete(iduser)
    .then((results) =>
      res.status(200).json(results)
    )
    .catch((err) => res.status(500).json({ message: err.message }));
};

//delet reclamation
async function delet_reclamation(req, res){
  const idrec = req.params.idrec;
  SchemaReclamation.findByIdAndDelete(idrec)
    .then((results) =>
      res.status(200).json(results)
    )
    .catch((err) => res.status(500).json({ message: err.message }));
};

//update user (Admin)
async function update_user(req,res){
  const { Fullname, Email, Password, Team, Role } = req.body;
  const iduser = req.params.iduser;
  const update = SchemaTeam.findByIdAndUpdate(iduser, { Fullname, Email, Password, Team, Role}, { new: true })
  console.log(update);
 update 
    .then((results) => res.status(200).json(results)) 
    .catch((err) => res.status(500).json({ message: err.message }));
}

//create user (Admin)
async function create_user(req, res){
  const id = `user${Math.floor(Math.random() * 100000)}`;
  const {Fullname, Email, Password, Team, Role, Municipality} = req.body;
  const account = new SchemaTeam({id, Fullname, Email, Password, Team, Role, Municipality});
  console.log(account);
  account
    .save()
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).json({ message: err.message }));
};

//display users
async function display_user(req,res){
  try {
    const users = await SchemaTeam.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du chargement des réclamations" });
  }
}

//display team members
async function display_team_members(req,res){
  const IdLeader = req.params.IdLeader;
  console.log( "id leader: ",IdLeader);
  try {
    const leader = await SchemaTeam.findOne({_id: IdLeader});
   console.log( "leader: ",leader);
    const team =  await SchemaTeam.find({Role: { $ne: 'team-lead' }, Team: leader.Team , Municipality: leader.Municipality});
    console.log(team);
    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

//display leaders
async function display_leader(req,res){
  try {
    const users = await SchemaTeam.find({Role: "team-lead"});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du chargement des réclamations" });
  }
}

//display messages to admin
async function display_message_admin(req,res){
  const IdLeader = req.params.IdLeader;
  try {
    const leaders = await SchemaMessage.find({leaderId: IdLeader});
    res.status(200).json(leaders);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du chargement des réclamations" });
  }
}

//display messages to leader
async function display_message_leader(req,res){
  const IdLeader = req.session.leaderId;
  console.log(IdLeader);
  try { 
    const leaders = await SchemaMessage.find({leaderId: IdLeader});
    console.log(leaders);
    res.status(200).json(leaders);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

//login user
async function login_accountUser(req,res){
// const username= "meriam";
//const password= "1234";
  const { fullname,password,team} = req.body;
  const {role} = "Team lead";
  const user = await SchemaUser.findOne({ fullname,team,role});
if (user && await bcrypt.compare(password, user.password)) {
  //The account exists
  console.log("the account exists");
  const userId = user.id;
    req.session.responsableId = userId;
  res.json({ message: "the account exists" });
} else {
  //Account does not exist
  console.log("the account not exists");
  res.json({ message: "the account not exists" });
}
}

//login admin
async function login_accountAdmin(req,res){
  //const username= "admin";const password= "admin";
    const { username,password } = req.body;
    const Role = "team-lead";
    console.log(username, password, Role);
  try{
    const user = await AdminDb.findOne({ username,password});
    const leader = await SchemaTeam.findOne({ Fullname:username,Password:password,Role});
    console.log(leader);
    if (!user && !leader) {
      console.log("the account not exists");
      return res.status(401).json({ message: "the account not exists" });
    }
    
  if(user){
    if(password != user.password){
      console.log("the account not exists");
      return res.status(401).json({ message: "the account not exists" });
    }
    console.log("the account admin exists");
    return res.status(201).json({ message:"the account admin exists", adminId: user._id});
  }else{
    if(password != leader.Password){
      console.log("the account not exists");
      return res.status(401).json({ message: "the account not exists" ,leaderId: leader._id});
    }
    const leadername = leader.Fullname;
    const leaderId = leader._id;
      req.session.leadername = leadername;
      req.session.leaderId = leaderId;
      console.log(req.session.leadername);
    console.log("the account leader exists");
    return res.status(201).json({ message:"the account leader exists", leaderId: leader._id});
 
  }
     }catch (err) {
    console.log("err:", err.message);
    return res.status(500).json({ message: "حدث خطأ في السيرفر" });
}
  }

//create reclamation
async function create_reclamation(req,res){ 
  //const account = new SchemaReclamation({ id: 1, Name: "meriam", email: "be2430423", password: "1234" });
  const { Name, Type, Surname, Phone, Municipality, Subscriber_ID, Address, Email, Complaint} = req.body;
  const id = `post${Math.floor(Math.random() * 100000)}`;
  const clientId = req.session.clientId ;
  console.log(req.session.clientId);
  const Photos = req.files.map(file =>({
    data: file.buffer,
    contentType: file.mimetype
  }));console.log("📸 عدد الصور المستقبلة:", req.files.length);
  const account = new SchemaReclamation({ clientId, id, Type, Name, Surname, Phone, Municipality, Subscriber_ID, Address, Email, Complaint, Photos});
  account
    .save()
    .then((result) => res.status(201).json(result))
    .catch((err) => res.status(400).json({ message: err.message }));
}

//display reclamation to client
async function display_reclamationClient(req,res){
  try {
    const clientId = req.session.clientId;
    console.log("idc: ",clientId);
    const reclamations = await SchemaReclamation.find({ clientId });
    console.log(reclamations);
    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//display information to reclamation 
async function display_information(req,res){
  try {
    const recId = req.params.IdReclamation;
    console.log(recId);
    const reclamations = await SchemaReclamation.findOne({ _id:recId });
    console.log(reclamations);
    const photo = reclamations.Photos[0]; // نستعمل أول صورة مثلا
    const base64Image = photo.data.toString('base64');
    const mimeType = photo.contentType; // مثلا: 'image/jpeg'
    res.status(200).json({reclamations,image: `data:${mimeType};base64,${base64Image}`});
  } catch (err) {
    res.status(500).json({ error: err.message });   
  }
}

//display reclamation to responsable
async function display_reclamationResponsable(req,res){
  try {
    const leadername = req.session.leadername;
    const reclamations = await SchemaReclamation.find({ Group:leadername });
    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du chargement des réclamations" });
  }
}

//display reclamation to Admin
async function display_reclamationAdmin(req,res){
  try {
    const reclamations = await SchemaReclamation.find({ Status: { $ne: 'Dismissed' } });
    
    if (reclamations.length === 0) {
      return res.status(400).json({ message: "Aucune réclamation en attente." });
    }
    res.status(200).json(reclamations);
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
}

//Analytics
const getStartDate = (filter) => {
  const now = new Date();
  if (filter === 'week') {
    now.setDate(now.getDate() - 7);
  } else if (filter === 'month') {
    now.setMonth(now.getMonth() - 1);
  } else if (filter === 'year') {
    now.setFullYear(now.getFullYear() - 1);
  }
  return now;
};

async function Analytics(req,res) {
   try {
    let Status = 'Pending';
    const reclamations = await SchemaReclamation.find({Status});
    const clients = await SchemaClient.find();
    Status = 'completed';
    const completedRec = await SchemaReclamation.find({Status});
     Status = 'In Progress';
    const progressRec = await SchemaReclamation.find({Status});
     Status = 'Dismissed';
    const deletedRec = await SchemaReclamation.find({Status});
    const newRec = reclamations.length;
    const client = clients.length;
    const penging = reclamations.length;
    const completed = completedRec.length;
    const progress = progressRec.length;
    const deleted = deletedRec.length;
    console.log(newRec,client,completed);
//Reclamation Status
    let { range } = req.query; // week | month | year
   console.log("range ",range);

if (typeof range !== 'string' || ['week', 'month', 'year'].includes(range) === false) {
  range = 'week'; // القيمة الافتراضية
}

    const startDate = getStartDate(range);
     // نجيب كامل الشكاوي من تاريخ محدد
    const all = await SchemaReclamation.find({ createdAt: { $gte: startDate } });

    const total = all.length;
    console.log("total: ",total);
    if (total === 0) {
      return res.json({
        completed: 0,
        inProgress: 0,
        pending: 0,
        reopened: 0
      });
    }

     // نحسب كل حالة
    const counts = {
      completed: all.filter(r => r.Status === 'completed').length,
      inProgress: all.filter(r => r.Status === 'In Progress').length,
      pending: all.filter(r => r.Status === 'Pending').length,
      reopened: all.filter(r => r.Status === 'Dismissed').length,
    };

    // نحسب النسبة المئوية
    const percentages = {
      completed: Math.round((counts.completed / total) * 100),
      inProgress: Math.round((counts.inProgress / total) * 100),
      pending: Math.round((counts.pending / total) * 100),
      reopened: Math.round((counts.reopened / total) * 100),
    };

    res.status(200).json({newRec: newRec,
  client: client,
  completed: completed,
  percentages: percentages,
  counts: counts});
  } catch (err) {
    res.status(500).json({ error: err.message});
  }
  
}

//Update reclamation status
  //Admin
  async function Admin(req,res){console.log(req.body)
    const { Group} = req.body;
    const IdReclamation = req.params.IdReclamation;
    let Status = "Dismissed"; 
    try{
      if (Group != null) {
        Status = "In Progress";
      }console.log(Status)
      const update = await SchemaReclamation.findByIdAndUpdate(IdReclamation, {Status , Group}, { new: true });

      res.status(200).json(update);
    }catch(err){
      res.status(500).json({ error: err.message });
    }
  }
  //Responsable
  async function Responsable(req,res){
    const { Status } = req.body;
    const IdReclamation = req.params.IdReclamation;
    SchemaReclamation.findByIdAndUpdate(IdReclamation, { Status }, { new: true })
      .then((results) => res.status(200).json(results))
      .catch((err) => res.status(500).json({ message: err.message }));
  }

module.exports = {create_account, login_account,create_user,login_accountUser,login_accountAdmin,
  create_reclamation,update_user,delet_user,Admin, Responsable,display_reclamationClient,
  Analytics,display_user,forget_password,verifyResetCode,reset_password,
  display_leader,display_message_admin,display_message_leader,display_reclamationResponsable,
  display_information,display_reclamationAdmin,delet_reclamation,display_team_members
};