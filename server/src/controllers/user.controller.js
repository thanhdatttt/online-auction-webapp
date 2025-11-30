import User from "../models/User.js";

// get user info
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    return res.status(200).json({user});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// change email
export const changeEmail = async (req, res) => {
  try {
    const id = req.user._id;
    const {newEmail, password} = req.body;

    // find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password does not match" });
    }

    // check existing email
    const existEmail = await User.findOne({email: newEmail});
    if (existEmail) {
      return res.status(400).json({message: "Email have been used"});
    }

    // update email
    user.email = newEmail;
    await user.save();

    return res.status(200).json({
      message: "Change email successfully",
      email: user.email
    });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// change fullname
export const changeName = async (req, res) => {
  try {
    const id = req.user._id;
    const {newFirstName, newLastName} = req.body;

    // find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // update full name
    user.firstName = newFirstName.trim();
    user.lastName = newLastName.trim();
    await user.save();

    return res.status(200).json({
      message: "Change name successfully",
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// change address
export const changeAddress = async (req, res) => {
  try {
    const id = req.user._id;
    const {newAddress} = req.body;

    // find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // update address
    user.address = newAddress;
    await user.save();

    return res.status(200).json({
      message: "Change address successfully",
      address: user.address
    });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// change birthdate
export const changeBirth = async (req, res) => {
  try {
    const id = req.user._id;
    const {newBirth} = req.body;

    // find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // check format date
    const dateObj = new Date(newBirth);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({message: "Birthddate is invalid" });
    }

    // update birthdate
    user.birth = dateObj;
    await user.save();
    return res.status(200).json({
      message: "Change birthdate successfully",
      birth: user.birth
    });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// change password
export const changePassword = async (req, res) => {
  try{
      const { oldPassword, newPassword } = req.body;

      // find user
      const user = await User.findById(req.user._id).select('+passwordHash');
      if (!user) {
        return res.status(404).json({message: "User not found"});
      }
  
      // check password
      if (!(await user.comparePassword(oldPassword))) {
          return res.status(401).json({ message: 'Your old password is not matched.' });
      }
  
      // Save new password
      user.passwordHash = newPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password changed successfully.' });
  } catch(err) {
      res.status(500).json({ message: err.message });
  }
}