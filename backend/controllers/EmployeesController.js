import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary'; // Assurez-vous que c'est bien importé

import Employees from '../models/Employees.js'; 
import Experts from '../models/Expert.js'; 


const jwtsecret = "mysecret";

const generateHashedPassword = async (motdepasse) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(motdepasse, saltRounds);
  return hashedPassword;
};




// const signup = async (req, res) => {
//   const {
//      nom,prenom, email, password, confirmPassword, phoneNumber, poste,
//      departement, 
//   } = req.body;

//   try {
//     // Vérification si l'utilisateur existe déjà
//     const existingUser = await Employees.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     // Vérification de l'image de profil
//     const imageFile = req.file;
//     if (!imageFile) {
//       return res.status(400).json({ message: 'Please upload an image' });
//     }

//     // Vérification de la confirmation du mot de passe
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     // Hachage du mot de passe
//     const hashedPassword = await bcrypt.hash(password, 8);

//     // Création de l'utilisateur
//     const newUser = new User({
//       prenom,
//       nom,
//       email,
//       password: hashedPassword,
//       image: imageFile.path, // Stocke l'URL de Cloudinary
//       confirmPassword: hashedPassword, // Vous pouvez décider de ne pas stocker la confirmation du mot de passe
//       phoneNumber,
//       poste,
//       departement,

//     });

//     await newUser.save();

//     res.json({ newUser });
//   } catch (error) {
//     console.error("Error during signup:", error);
//     res.status(500).json({ message: 'Error registering user' });
//   }
// };






const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!process.env.jwt_Secret) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    const user = await Employees.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "Employees Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, Employees.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: Employees._id }, process.env.jwt_Secret, {
      expiresIn: 31557600, // 24 hours
    });

    req.session.token = token;

    res.status(200).json({
      _id: Employees._id,
      nom: Employees.nom,
      email: Employees.email,
      token: token,
      userType: Employees.userType, // Include user role here
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error signing in' });
  }
};



export function getUserById(req, res) {
  const userId = req.params.id;

  Employees.findById(userId)
    .then((doc) => {
      if (!doc) {
        // Gérer le cas où l'utilisateur n'est pas trouvé
        return res.status(404).json({ message: 'Employees non trouvé' });
      }

      if (doc.image) {
        // Si doc.image contient le nom du fichier, construis l'URL complète
        doc.image = cloudinary.url(doc.image); // Utiliser uniquement le nom de fichier
        console.log("doc.image:", doc.image)
      }

      res.status(200).json(doc);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      res.status(500).json({ error: err });
    });
}


export async function updateUserProfile(req, res) {
  try {
    // Extraire les champs du corps de la requête
    const {nom,prenom, email, password, confirmPassword, phoneNumber, poste,
      departement,  } = req.body;

    // Préparer l'objet à mettre à jour
    let updateData = {nom, prenom, email, phoneNumber, poste,
      departement,  };

    // Gérer le fichier image si présent
    if (req.file) {
      console.log('File received:', req.file);
      updateData.image = req.file.path; // Utiliser le chemin Cloudinary
    }

    // Vérifier si le mot de passe doit être mis à jour
    if (password && password === confirmPassword) {
      // Hacher le nouveau mot de passe avant de le stocker
      updateData.password = await bcrypt.hash(password, 8);
    } else if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await Employees.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Répondre en fonction du résultat
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
  }
}


const putPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    const user = await Employees.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    Employees.password = hashPassword;
    Employees.resetPasswordToken = undefined;
    Employees.resetPasswordExpires = undefined;

    await Employees.save();

    return res.json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export function getAll(req, res) {
  Employees.find({})
  .then(docs => {
    // Mapper les documents pour ajouter l'URL de l'image
    const usersWithImages = docs.map(doc => {
      if (doc.image) {
        // Construire l'URL complète pour l'image
        doc.image = cloudinary.url(doc.image); // Utiliser uniquement le nom de fichier
      }
      return doc; // Retourner le document modifié
    });

    res.status(200).json(usersWithImages);
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
}




export async function DeleteUser(req, res) {
  const id =req.params.id
  const prd = await Employees.findByIdAndDelete(id);
  res.status(200).json({"message":" user deleted"});
}


export async function addEmployee(req, res) {
  try {
    console.log("Données reçues :", req.body); // Ajoutez cette ligne pour déboguer

    const { nom, email, password, phoneNumber, departement, poste, prenom } = req.body;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);


    const newEmployees = new Employees({
      nom,
      prenom,
      email,
      departement,
      poste,
      password: hashedPassword,
      phoneNumber,
      image: imageFile.path,
    });

    await newEmployees.save();

    console.log('Employee ajouté avec succès:', newEmployees);
    return res.status(201).json(newEmployees);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du Employee:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}



export {  signin, putPassword};