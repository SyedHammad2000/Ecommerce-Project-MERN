import UserModel from "../models/Usermodel.js";
// import { Hashpassword, comparepassword } from "../utils/hashpassword.js";
import JWT from "jsonwebtoken";

import { token } from "morgan";
import orderModel from "../models/orderModel.js"

// create controller
// export const registerController = async (req, res) => {
//   try {
//     const { name, email, password, phone, address } = req.body;
//     // validations
//     if (!name) {
//       return res.send("Name not found");
//     }
//     if (!email) {
//       return res.send("email not found");
//     }
//     if (!password) {
//       return res.send("password not found");
//     }
//     if (!phone) {
//       return res.send("phone not found");
//     }
//     if (!address) {
//       return res.send("address not found");
//     }
//     const existinguser = await UserModel.findOne({ email });
//     //existing user
//     if (existinguser) {
//       return res.status(200).send({
//         success: false,
//         message: "User already exist",
//       });
//     }
//     // register new user
//     // const hashedPassword = await Hashpassword(password);
//     const newuser = await new UserModel({
//       name,
//       email,
//       password,
//       phone,
//       address,
//     });
//     await newuser.save();
//     res.status(201).send({
//       success: true,
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: `Error${error}`,
//     });
//   }
// };

export const registerController = async (req, res) => {
  try {
    const { email, name, password, phone, address, answer } = req.body;
    if (!email) {
      return res.send("email not found");
    }
    if (!name) {
      return res.send("name not found");
    }
    if (!password) {
      return res.send("password not found");
    }
    if (!phone) {
      return res.send("phone not found");
    }
    if (!address) {
      return res.send("address not found");
    }
    if (!answer) {
      return res.send("answer not found");
    }
    const existinguser = await UserModel.findOne({ email });
    if (existinguser) {
      res.status(404).send({
        success: false,
        message: "User already existed",
      });
    }
    // const hashedpassword = await Hashpassword(password);
    const newuser = new UserModel({
      name,
      email,
      password,
      phone,
      address,
      answer,
    });
    newuser.save();
    res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error${error}`,
    });
  }
};

// export const Logincontroller = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(email, password);

//  if(!email || !password){
//    return res.status(200).send({
//     success:false,
//     message:"Please provide email and password"
//    })
//  }

//     const userisMatch = await Usermodel.findOne({ email });
//     if (!isMatch) {
//       return res
//         .status(400)
//         .send({ success: false, message: "User not found" });
//     }
//     const userpassword = password===userisMatch.password;
//     if (!userpassword) {
//       return res
//         .status(400)
//         .send({ success: false, message: "Invalid password" });
//     }

//     //token
//     let token = JWT.sign(
//       {
//         _id: userisMatch._id,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );
//     res.status(201).send({
//       success: true,
//       message: "Login successfully",
//       userisMatch: {
//         name: userisMatch.name,
//         email: userisMatch.email,
//         phone: userisMatch.phone,
//         address: userisMatch.address,
//       },
//     });
//     console.log(token);
//   }
//   catch (error) {
//     res.status(500).send({
//       success: false,
//       message: error,
//     });
//   }
// };

// Login User
export const Logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validations

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Please provide email and password",
      });
    }
    //check login user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Please register first",
      });
    }

    const isMatch = (await password) === user.password;
    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    else {
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1y",
      });
      res.status(200).send({
        success: true,
        message: "Login Succesfuly",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
    console.log(token);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error${error}`,
    });
  }
};
//forget password controller
export const ForgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide email",
      });
    }
    if (!answer) {
      return res.status(400).send({
        success: false,
        message: "Please provide answer",
      });
    }
    if (!newpassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide new password",
      });
    }
    let user = await UserModel.findOne({ email, answer });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Wrong Email And Password",
      });
    }
    await UserModel.findByIdAndUpdate(user._id, { password: newpassword });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Something Went Wrong`,
      error,
    });
  }
};

export const testController = (req, res) => {
  res.send("Protected Routes");
};

// update user profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;

    // update in userprofile
    const user = await UserModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ message: "Password must be 6 character long" });
    }

    const updateuser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: password || user.password,
        address: address || user.address,
        phone: phone || user.phone,
      },
      { new: true }
    );
    await updateuser.save();
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updateuser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};


// orderslist 
export const orderListController = async (req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};