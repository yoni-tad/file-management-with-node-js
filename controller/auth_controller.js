const fs = require("fs");
const UserSchema = require("../models/user_model");
const FolderSchema = require("../models/folder_model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const axios = require('axios')
const mongoose = require('mongoose')
const ContactSchema = require("../models/contact_model");
const PaymentSchema = require("../models/payment_model");

exports.Register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const checkEmail = await UserSchema.findOne({ email: email });
    if (checkEmail) {
      return res.status(409).json({ message: "This email already used" });
    }

    const user = await UserSchema.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    const createFolder = fs.mkdirSync("uploads/" + email);
    const storeFolder = await FolderSchema.create({
      folderName: email,
      folderPath: "/",
      email: email,
    });
    res.status(201).json({ message: "Registration successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = await jwt.sign({ user: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });
    res.json(token);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.Profile = async (req, res) => {
  res.json({
    message: `Welcome ${req.user.firstName}`,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    quota: req.user.quota,
    role: req.user.role,
  });
};

exports.UpdateProfile = async (req, res) => {
  const {firstName, lastName, password} = req.body
  const email = req.user.email

  const checkUser = await UserSchema.findOne({email: email})
  if(!checkUser) return res.status(404).json({message: 'User not found!'})

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const response = await UserSchema.findOneAndUpdate({email, email}, {
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword
  })

  res.json({message: 'Profile update successfully'})
}

exports.Contact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const response = await ContactSchema.create({
      name: name,
      email: email,
      phone: phone,
      message: message,
    });

    res.status(201).json({ message: "Your message sent!" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.InitPayment = async (req, res) => {
  const {email, amount} = req.body
  const transactionId = new mongoose.Types.ObjectId().toString();

  try {
    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount: amount,
        currency: 'ETB',
        email: email,
        tx_ref: transactionId,
        callback_url: `https://fileframe.ynitsolution.com/payment.html?tx_ref=${transactionId}`,
        return_url: `https://fileframe.ynitsolution.com/payment.html?tx_ref=${transactionId}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_KEY}`,
        },
      }
    );

    const newPayment = PaymentSchema.create({
      transactionId,
      amount,
      email,
      status: 'pending',
    })

    res.json({ paymentUrl: response.data.data.checkout_url })
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }

}

exports.paymentCallback = async (req, res) => {
  const { tx_ref, status } = req.body;

  try {
    const payment = await PaymentSchema.findOneAndUpdate(
      { transactionId: tx_ref },
      { status: status },
      { new: true }
    );

    const email = payment.email
    const updateUser = await UserSchema.findOneAndUpdate({email: email}, {role: 'premium'})

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
}
