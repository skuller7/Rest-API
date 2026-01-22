const User = require('../models/user.model')

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Ne vraćaj passworde
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // Ne vraćaj password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }   
}

const createUser = async (req, res) => {
    try {
        // Osiguraj da se role ne može postaviti prilikom kreiranja (osim ako nije admin)
        // Za sada, svaki novi korisnik je 'user'
        const userData = { ...req.body };
        if (userData.role && userData.role !== 'user') {
            // Ako pokušava da postavi role, ukloni ga (promocija se radi preko promoteUser)
            delete userData.role;
        }
        
        const user = await User.create(userData);
        // Vrati korisnika bez passworda
        const userResponse = await User.findById(user._id).select('-password');
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ako pokušava da promeni role preko updateUser, zabrani to (koristi promoteUser)
        if (req.body.role) {
            return res.status(403).json({ 
                message: 'Cannot change role via update. Use /:id/promote endpoint instead.' 
            });
        }

        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        
        // Vrati korisnika bez passworda
        const updatedUser = await User.findById(id).select('-password');
        res.status(200).json(updatedUser)

    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({message:"User deleted successfully"})

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const promoteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // Očekuje se { role: 'admin' } ili { role: 'operator' }

        // Validacija role
        const validRoles = ['user', 'operator', 'admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Allowed roles: user, operator, admin' });
        }

        // Pronađi korisnika
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ako nije prosleđena role, default promocija na admin
        const newRole = role || 'admin';

        // Ažuriraj role
        user.role = newRole;
        await user.save();

        // Vrati ažuriranog korisnika (bez passworda)
        const updatedUser = await User.findById(id).select('-password');
        res.status(200).json({
            message: `User promoted to ${newRole} successfully`,
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    promoteUser
};