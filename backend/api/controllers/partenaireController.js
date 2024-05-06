require('dotenv').config();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Partenaire = require('../models/Partenaire');
const nodemailer = require('nodemailer');
const Denree = require('../models/Denree');
const { json } = require('body-parser');

const sendWelcomeEmail = async (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Bienvenue chez notre plateforme!',
        text: `Bonjour ${name},\n\nBienvenue sur notre plateforme !`,
        html: `<p>Bonjour <strong>${name}</strong>,</p><p>Bienvenue sur notre plateforme !</p>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email', error);
    }
};



const registerPartenaire = async (req, res) => {
    try {
        console.log('LOL '+JSON.stringify(req.body));
        const { email, nom, password, telephone, adresse } = req.body;
        
        const hashedPassword = await argon2.hash(password);

        const newPartenaire = await Partenaire.create({
            nom,
            email,
            password: hashedPassword,
            telephone,
            adresse
        });

        await sendWelcomeEmail(email, nom);

        res.status(201).json({ message: 'Registration successful', partenaire: newPartenaire });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loginPartenaire = async (req, res) => {
    try {
        const { email, password } = req.body;

        const partenaire = await Partenaire.findOne({ where: { email } });
        if (!partenaire) {
            return res.status(404).json({ error: 'Partenaire not found' });
        }

        const validPassword = await argon2.verify(partenaire.password, password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }


        const token = jwt.sign({ id: partenaire.ID_Commercant, email: partenaire.email }, 'your_secret_key_here', { expiresIn: '1h' });

        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 3600000, 
            sameSite: 'strict',
            path: '/', 
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProductsForPartenaire = async (req, res) => {
    try {
        const jwtSecret = "your_secret_key_here";
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: 'No token found' });
        }

        const decoded = jwt.verify(token, jwtSecret);
        const idPartenaire = decoded.id; 


        const partenaire = await Partenaire.findOne({ where: { ID_Commercant: idPartenaire } });

        if (partenaire) {
            const idCommercant = partenaire.ID_Commercant;

            const allDenree = await Denree.findAll({
                where: {
                    id_commercant: idCommercant
                }
            });

            if(allDenree){
                console.log('Test : '+JSON.stringify(allDenree));
                return res.status(200).json({ data: allDenree });
            }else{
                return res.status(200).json({ data: {} });
            }
          } else {
          }
        
    } catch (error) {
        console.error('Error during execution :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const addProductForPartenaire = async (req, res) => {
    try {
        const jwtSecret = "your_secret_key_here";
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: 'No token found' });
        }

        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.id) { 
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { datePeremption, quantite, nomProduit, categorie } = req.body;
        console.log('CATATA : '+categorie);
        const idPartenaire = decoded.id; 

        console.log('PARTENZIRE : '+ idPartenaire);

        const partenaire = await Partenaire.findOne({ where: { ID_Commercant: idPartenaire } });
        console.log('PARTENZIRE ELEEMENT : '+ JSON.stringify(partenaire));


        if (partenaire) {
            const idCommercant = partenaire.ID_Commercant;

            const mappedData = {
                id_commercant: idCommercant,
                type: categorie,
                quantite: quantite,
                date_peremption: datePeremption,
                nom: nomProduit
            }

            console.log('TETTETT : '+ JSON.stringify(mappedData));

            const created = await Denree.create(
                mappedData
            );
            
            return res.status(201).json({ data: created });
            
        } else {
            return res.status(500).json({ error: 'Partenaire not found' });
        }
        
    } catch (error) {
        console.error('Error during execution :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const deleteProductForPartenaire = async (req, res) => {
    try {
        const jwtSecret = "your_secret_key_here";
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: 'No token found' });
        }

        const decoded = jwt.verify(token, jwtSecret);
        const idPartenaire = decoded.id; 

        const { idDenree } = req.params;
        console.log('YEYEY : '+idPartenaire);

        const partenaire = await Partenaire.findOne({ where: { ID_Commercant: idPartenaire } });

        if (partenaire) {
            const idCommercant = partenaire.ID_Commercant;
            console.log('HAHAH : '+idCommercant);
            const denreeToDelete = await Denree.destroy({
                where: {
                    id_commercant: idCommercant,
                    ID_Denree: idDenree
                }
            });

            return res.status(200).json({ success: true, message: 'Product deleted' });
        } else {
            return res.status(500).json({ error: 'Partenaire not found' });
        }   
        
    } catch (error) {
        console.error('Error during execution :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const updateProductForPartenaire = async (req, res) => {
    try {
        const jwtSecret = "your_secret_key_here";
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: 'No token found' });
        }

        const decoded = jwt.verify(token, jwtSecret);
        const idPartenaire = decoded.id; 
        const { datePeremption, quantite, nomProduit, caregorie, idMaraude } = req.body;
        const { idDenree } = req.params; 

        const partenaire = await Partenaire.findOne({ where: { ID_Commercant: idPartenaire } });

        let idCommercant;
        if (partenaire) {
            idCommercant = partenaire.idCommercant;

            let mappedData;
            if(idMaraude == null | undefined){
                mappedData = {
                    id_commercant: idCommercant,
                    type: caregorie,
                    quantite: quantite,
                    date_peremption: datePeremption,
                    nom_produit: nomProduit
                }
            } else {
                mappedData = {
                    id_commercant: idCommercant,
                    type: caregorie,
                    quantite: quantite,
                    date_peremption: datePeremption,
                    nom_produit: nomProduit,
                    id_maraude: idMaraude
                }
            }
            
            console.log('PAPAPOKPOK : '+partenaire.ID_Commercant);

            const updated = await Denree.update(mappedData, {
                where: { id_commercant: partenaire.ID_Commercant, ID_Denree: idDenree }
            });

            if (updated) {
                return res.status(200).json({ success: true, message: 'Product updated successfully', data: updated });
              } else {
                return res.status(500).json({ error: 'Failed to update product' });
              }
                        
        } else {
            return res.status(500).json({ error: 'Partenaire not found' });
        }
        
    } catch (error) {
        console.error('Error during execution :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getPartenaireInfo = async (req, res) => {
    try {
        const jwtSecret = "your_secret_key_here";
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ error: 'No token found' });
        }

        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.id) { 
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userId = decoded.id; 
        const idCommercant = decoded.id;
        const email = decoded.email;

        console.log('ID_Commercant:', idCommercant);
        console.log('Email:', email);
        return res.status(200).json({ success: true, id: userId });
        
    } catch (error) {
        console.error('Error during execution:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { registerPartenaire, loginPartenaire, addProductForPartenaire, deleteProductForPartenaire, getProductsForPartenaire, updateProductForPartenaire, getPartenaireInfo };
